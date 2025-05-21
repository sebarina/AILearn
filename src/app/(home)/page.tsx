"use client";
import React from "react";
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { useRef } from "react";
import { useEffect } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import ReactMarkdown from "react-markdown"
import { Badge } from "flowbite-react";
import { Textarea } from "flowbite-react";
import { startSpeechRecognition } from "@/utils/speechRecognition";
import { getImageAnalysis } from "@/utils/tools";
import Modal from "react-modal";

import Link from "next/link";

import { request } from "http";
const page = () => {
    const [imageList,setImageList] = useState<any[]>([])
    const [selectedIndex,setSelectedIndex] = useState(0);
    const [isRecording,setIsRecording] = useState(false);
    const [inputText,setInputText] = useState("");
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [modalContent,setModalContent] = useState("");

    const speechRecognitionRef = useRef<any>(null);
    const getBasicInfo = async ()=>{
        const response = await fetch("/api/home/info", {
            method:"GET"
        });
        const data = await response.json();
        if (data.code === 200) {
            setImageList(data.data.list)
        }

    }

    const getSelectedImage = ()=>{
        if (selectedIndex < imageList.length) {
            return imageList[selectedIndex];
        } else {
            return null;
        }
    };

    const getTagColor = (index:number) => {
        const colors = ["bg-primary", "bg-secondary", "bg-success","bg-warning" ,"bg-info","bg-error"];
        if (index < colors.length) {
            return colors[index];
        }
        return colors[index % colors.length]; // 默认返回第一个颜色
    };

    const getXuezuoFenxi = async ()=>{
        if(modalContent == ""){
            const analysis = await getImageAnalysis(getSelectedImage().generated_image_url)
            if (analysis != null) {
                setModalContent(analysis);
                setIsModalOpen(true)
            }
           
       } else {
            setIsModalOpen(true);
       }
    }

    useEffect(()=>{
        getBasicInfo();
    },[])

    if (getSelectedImage() == null) {
        return (<>
        <div className="p-6 m-6 text-lg font-bold text-center">
            加载中...
        </div>
        </>)
    }

    return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <button id="prev-image-btn" className={`bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-full font-medium flex items-center ${selectedIndex==0? 'opacity-0':''}`}
                    onClick={()=>{
                        if (selectedIndex > 0) {
                            setSelectedIndex(selectedIndex-1);
                            setModalContent("");
                        }
                    }}>
                        <Icon icon="lucide:chevron-left" width="24" height="24"></Icon>上一张
                    </button>
                    <button id="next-image-btn" className={`bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-full font-medium flex items-center ${selectedIndex>=imageList.length-1? 'opacity-0':''}`}
                        onClick={()=>{
                        if (selectedIndex < imageList.length-1) {
                            setSelectedIndex(selectedIndex+1);
                            setModalContent("");
                        }
                    }}>
                        下一张<Icon icon="lucide:chevron-right" width="24" height="24"></Icon>
                    </button>
                </div>
                

                <div id="picture-container" className="bg-white rounded-xl shadow-md flex justify-center items-center overflow-hidden">
                    <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                        <Image alt="" 
                            src={getSelectedImage().generated_image_url}
                            width={1200}  // 原始宽度
                            height={800}  // 原始高度
                            layout="responsive"
                            style={{ height: 'auto', width: '100%' }}
                            placeholder="empty"/>
                        <div className="absolute inset-2 flex items-center justify-end" onClick={
                            ()=>{
                               getXuezuoFenxi();
                            }
                        }>
                            <div className="bg-black bg-opacity-50 rounded-full p-4 text-white">
                                <Icon icon="lucide:badge-help" width="24" height="24"></Icon>
                            </div>
                        </div>
                    </div>
                </div>
                
                
                <div id="observation-prompts" className="bg-white p-4 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-blue-700 mb-2 flex items-center">
                         <Icon icon="lucide:search" width="24" height="24" className="mr-2"></Icon>观察提示
                    </h2>
                    <div className="text-gray-700 space-y-1 note">
                        <ReactMarkdown>{imageList[selectedIndex].writing_suggestions}</ReactMarkdown>                                
                    </div>
                </div>
                    
            </div>

            <div className="space-y-6"> 
                <div id="drag-words-container" className="bg-white p-4 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-purple-700 mb-2 flex items-center">
                         <Icon icon="lucide:letter-text" width="24" height="24" className="mr-2"></Icon>提示词
                    </h2>
                    
                    <div id="word-bank" className="p-2 border border-dashed border-gray-300 rounded-lg mb-4 min-h-[120px]">
                        <div className="flex flex-wrap gap-2 p-2">
                        {
                            getSelectedImage().good_words_phrases.map((item:any,index:number)=>(
                                <Badge className={`${getTagColor(index)} rounded`}>
                                    {item}
                                </Badge>
                            ))
                            
                        }
                        </div>
                    </div>
                </div> 
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-green-600 mb-2 flex items-center">
                        <Icon icon="lucide:mic-vocal" width="24" height="24" className="mr-2"></Icon>说图练表达
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">录下你对图片的描述，锻炼口语表达能力</p>
                    
                    <div className="flex justify-center space-x-4">
                        <button id="start-record-btn" className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center ${isRecording? 'hidden':''}`}
                        onClick={()=>{
                            setIsRecording(true);
                            speechRecognitionRef.current = startSpeechRecognition((result:any)=>{
                                console.log(result);
                                const textAreaText = (document.getElementById("writing-textarea") as HTMLTextAreaElement).value;
                                const text = `${textAreaText} ${result.text}` ;
                                setInputText(text);
                            },(error:any)=>{
                                console.log(error);
                            });
                        }}>
                            <Icon icon="lucide:mic" width="24" height="24" className="mr-2"></Icon>开始录音
                        </button>
                        <button id="stop-record-btn" className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center ${isRecording?'':'hidden'}`}
                        onClick={()=>{
                                setIsRecording(false);
                                speechRecognitionRef.current();
                            }}>
                        <Icon icon="lucide:mic" width="24" height="24" className="mr-2"></Icon>停止录音
                        </button>
                    </div>
                </div>              
                <div id="writing-area" className="bg-white p-4 rounded-xl shadow-md relative">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">我的写话：</h3>
                    <Textarea
                        id="writing-textarea"
                        name="description"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors resize-none"
                        rows={6}
                        placeholder="请输入你的想法..."
                        value={inputText}
                        onChange={(e)=>{
                            setInputText(e.target.value);
                        }}
                    >

                    </Textarea>
                </div>
                
               
                <div id="ai-feedback" className="bg-white p-4 rounded-xl shadow-md hidden transition-all duration-300">
                    <h3 className="text-lg font-semibold text-purple-600 mb-2">
                        <i className="fas fa-robot mr-2"></i>AI小老师的评价
                    </h3>
                    <div className="bg-purple-50 rounded-lg p-4 mb-4">
                        <p className="feedback-text text-gray-700"></p>
                    </div>
                    <div className="feedback-icons flex justify-center space-x-4 mt-4"></div>
                </div>

    
                <div className="flex space-x-4 mt-6">
                    <button id="get-feedback-btn" className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg shadow-md transition-colors font-medium">
                        <i className="fas fa-comment-dots mr-2"></i>获取AI评价
                    </button>
                    <button id="submit-writing-btn" className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg shadow-md transition-colors font-medium">
                        <i className="fas fa-paper-plane mr-2"></i>完成并保存
                    </button>
                </div>
            </div>
        </div>
        <Modal isOpen={isModalOpen} 
        onRequestClose={()=>setIsModalOpen(false)}
        contentLabel="AI小老师"
        className="modal"
        style={{
            content: {
              width: '100%',
              maxHeight: '90vh',
              margin: 'auto',
              padding: '20px',
              borderRadius: '8px',
              overflowY: 'auto', // 内容区域可滚动
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              transform: 'translate(-50%, -50%)', // 垂直居中
              position: 'absolute',
              zIndex: 1001,
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000, // 确保模态框在其他元素之上
            },
        }}
        >
            <div className="bg-white rounded-2xl mt-20 px-4 py-6 animate-slide-up">
                <ReactMarkdown>{modalContent}</ReactMarkdown>   
                   
            </div>
        </Modal>
    </>
    );
};

export default page;
