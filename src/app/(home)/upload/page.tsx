
"use client";

import React, { use } from "react";
import { Input } from "@headlessui/react";
import { useState } from 'react';
import ReactMarkdown from "react-markdown"
import SpeakPractice from "../components/SpeakPractice";
import { getImageAnalysis } from "@/utils/tools";
import { Textarea } from "flowbite-react";
const page = ()=>{
    const [errorMessage,setErrorMessage] = useState("");
    const [uploadedFile,setUploadedFile] = useState<any>(null);
    const [previewSource,setPreviewSource] = useState("");
    const [imageDesc,setImageDesc] = useState("");
    const [uploadImageUrl,setUploadImageUrl] = useState("");
    const [isDragging,setIsDragging] = useState(false);
    const [analysisResult,setAnalysResult] = useState("");
    const doUpload = ()=>{
        const imageUpload = document.getElementById('image-upload') as HTMLInputElement;
        imageUpload.click();
    };

    const handleFileUpload = (file:any) => {
        if (file == null) {
            return;
        }
        if (!file.type.startsWith('image/')) {
            setErrorMessage('请上传图片文件 (例如 JPG, PNG, GIF)。')
            // showError();
            // resetImageUploadUI();
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setErrorMessage('图片太大了，请上传小于5MB的图片。')
            //  showError('图片太大了，请上传小于5MB的图片。');
            //  resetImageUploadUI();
             return;
        }
        setErrorMessage("");
        setUploadedFile(file)
        setPreviewSource(URL.createObjectURL(file));
    }

    const requestAnalysis = async()=>{
        if (uploadImageUrl != "") {
            const result = await getImageAnalysis(uploadImageUrl,imageDesc)
            if (result != null) {
                setAnalysResult(result);
            }
                
        } else {
            const formData = new FormData();
            formData.append('file', uploadedFile);
            const response = await fetch("/api/image/upload",{
                method:"POST",
                body:formData
            })
            const responseJson = await response.json();
            if (responseJson.code == 200) {
                const imageUrl = responseJson.data.url;
                console.log(imageUrl);

                const result = await getImageAnalysis(imageUrl,imageDesc)
                console.log(result)
                if (result != null) {
                    setAnalysResult(result);
                }

            }
        }

       

    };

    return (
        <>
        <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl w-full">
            {
                errorMessage != "" && (
                <div id="error-message-area" className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md" role="alert">
                    <p className="font-bold">哎呀，出错了！</p>
                    <p id="error-text">{errorMessage}</p>
                </div>
                )
            }
            <section id="upload-section" className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg transition-all duration-500 ease-in-out mb-8">
                <h2 className="text-2xl font-semibold text-pink-600 mb-4 text-center">第一步：上传图片</h2>
                <div id="upload-area" className="cursor-pointer" onClick={
                    ()=>{
                        if (uploadedFile == null) {
                            doUpload();
                        }
                    }
                }>
                    <div id="upload-placeholder" className={`border-4 border-dashed border-yellow-400 rounded-lg p-8 sm:p-12 text-center hover:border-yellow-500 hover:bg-yellow-50 transition-colors ${isDragging? 'border-yellow-500 bg-yellow-50' : ''} ${uploadedFile==null? '' : 'hidden'}`}
                    onDragOver={(e)=>{
                        e.preventDefault();
                       setIsDragging(true);
                    }} onDragLeave={(e)=>{
                        setIsDragging(false);
                    }}
                    onDrop={(e)=>{
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files != null) {
                            console.log("drop: files");
                            handleFileUpload(e.dataTransfer.files[0]);
                        }
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-yellow-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 text-lg">点击这里选择图片，或者拖拽图片到这里</p>
                        <p className="text-sm text-gray-500 mt-1">（支持 JPG, PNG, GIF 等格式）</p>
                    </div>
                    <div id="image-preview" className={`text-center ${uploadedFile==null? 'hidden' : ''}`}>
                        <img id="preview-img" src={previewSource} alt="图片预览" className="max-h-72 w-auto mx-auto rounded-lg shadow-md mb-4 border-2 border-yellow-300"/>
                        
                        <div className="">
                            <Textarea
                            id="writing-textarea"
                            name="description"
                            className="w-full p-3 border mb-4 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors resize-none"
                            rows={4}
                            placeholder="图片描述信息..."
                            value={imageDesc}
                            onChange={(e)=>{
                                setImageDesc(e.target.value);
                            }}
                            ></Textarea>
                        </div>
                        <div className="flex justify-center space-x-3">
                            <button id="change-image" className=" bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg shadow-md transition-colors font-medium"
                            onClick={(e)=>{
                                e.preventDefault();
                                doUpload();
                            }}>换一张图</button>
                            <button id="analyze-button" className=" bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg shadow-md transition-colors font-medium"
                            onClick={(e)=>{
                                e.preventDefault();
                                requestAnalysis();
                            }}>开始分析!</button>
                        </div>
                    </div>
                </div>
                <Input type="file" id="image-upload" className="hidden" accept="image/*" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                    if (e.target.files != null) {
                        handleFileUpload(e.target.files[0]);
                    }
                }}/>
            </section>
            {
                analysisResult != "" && (
                <section id="results-section" className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg transition-all duration-500 ease-in-out mb-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-blue-600 mb-3 flex items-center">
                            <span className="icon-text">✍️</span> 写作指导
                        </h2>
                        <div id="good-words-sentences" className="p-4">
                            <ReactMarkdown>{analysisResult}</ReactMarkdown>
                        </div>
                    </div>
                </section>
                )

            }

            {
                analysisResult != "" && (
                    <section id="practice-section" className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg transition-all duration-500 ease-in-out mb-8 space-y-6">
                        <SpeakPractice></SpeakPractice>
                    </section>
                )
            }

        </div>
        </>
    );
}
export default page;