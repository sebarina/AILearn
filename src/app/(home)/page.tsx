"use client";
import React from "react";
import { useState } from 'react';
import { useEffect } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import ReactMarkdown from "react-markdown"
import { Badge } from "flowbite-react";
import { getImageAnalysis } from "@/utils/tools";
import { imageData } from "@/utils/data";
import Modal from "react-modal";
import SpeakPractice from "./components/SpeakPractice";
const page = () => {
    const [imageList,setImageList] = useState<any[]>([])
    const [selectedIndex,setSelectedIndex] = useState(0);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [modalContent,setModalContent] = useState("");
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
        // setModalContent("当然可以！以下是根据你提供的图片生成的一年级看图写话写作指导👇\n\n---\n\n### 🖼 图画内容描述\n\n秋天到了，金黄的稻田里，大人和小孩正在忙着收割庄稼。天上飞着大雁，还有一只小鸟飞过。大家脸上都带着笑容，丰收的季节真美好！\n\n---\n\n### ❓ 提示性问题\n\n1. 图里有谁？他们在做什么？\n2. 稻田里有什么？颜色是什么？\n3. 天空中有什么？你觉得天气怎么样？\n4. 如果你在田野里，你会做什么？\n\n---\n\n### ✏️ 写作引导词\n\n今天、我看到、大家正在、金黄金黄的、飞来飞去的、开心地、慢慢地、最后\n\n---\n\n### 📝 示例范文（贴近一年级儿童）\n\n秋天到了，稻田变得金黄金黄的。小朋友在田里拔稻子，叔叔阿姨也在忙着收割。天上飞着一群大雁，还有一只小鸟飞过来，好像在说：“你们真棒！”大家都很开心。秋天真是一个快乐的季节！\n\n---\n\n需要我继续为其他图片生成类似内容吗？也可以帮你整理成卡片或打印版哦 😊\n");
        // setIsModalOpen(true)
        if(modalContent == ""){
            const temp = getSelectedImage();
            const analysis = await getImageAnalysis(temp.generated_image_url,temp.image_prompt_suggestion)
            if (analysis != null) {
                setModalContent(analysis);
                setIsModalOpen(true)
            }
           
       } else {
            setIsModalOpen(true);
       }
    }

    useEffect(()=>{
        setImageList(imageData);
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
                    <SpeakPractice></SpeakPractice>
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
                    <button id="get-feedback-btn" className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg shadow-md transition-colors font-medium flex items-center justify-center">
                        <Icon icon="lucide:message-square-more" width="24" height="24" className="mr-2"></Icon>获取AI评价
                    </button>
                    <button id="submit-writing-btn" className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg shadow-md transition-colors font-medium flex items-center justify-center">
                        <Icon icon="lucide:save-all" width="24" height="24" className="mr-2"></Icon>完成并保存
                    </button>
                </div>
            </div>
        </div>
        <Modal isOpen={isModalOpen} 
        onRequestClose={()=>setIsModalOpen(false)}
        contentLabel="AI小老师"
        className="modal focus:outline-none focus:ring-0"
        style={{
            content: {
              width: '100%',
              maxHeight: '90vh',
              margin: 'auto',
              padding: '20px',
            //   borderRadius: '8px',
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
                <div className="absolute right-4 top-4 flex items-center justify-end" onClick={
                   ()=>{
                        setIsModalOpen(false);
                    }         
                }>
                    <div className="bg-black bg-opacity-50 rounded-full p-4 text-white">
                        <Icon icon="lucide:circle-x" width="24" height="24"></Icon>
                    </div>
                </div>
                <ReactMarkdown>{modalContent}</ReactMarkdown>   
                   
            </div>
        </Modal>
    </>
    );
};

export default page;
