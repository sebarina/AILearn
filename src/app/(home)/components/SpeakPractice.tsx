"use client";
import React from "react";
import { useState } from 'react';
import { useRef } from "react";
import { Icon } from "@iconify/react";
import { Textarea } from "flowbite-react";
import { startSpeechRecognition } from "@/utils/speechRecognition";

const SpeakPractice = ()=>{
    const [isRecording,setIsRecording] = useState(false);
    const [inputText,setInputText] = useState("");
    const speechRecognitionRef = useRef<any>(null);
    return (
        <>
                            <h2 className="text-xl font-bold text-green-600 mb-2 flex items-center">
                                <Icon icon="lucide:mic-vocal" width="24" height="24" className="mr-2"></Icon>说图练表达
                            </h2>
                            <p className="text-gray-600 text-sm mb-4">录下你对图片的描述，锻炼口语表达能力</p>
                            <Textarea
                                id="writing-textarea"
                                name="description"
                                className="w-full p-3 border mb-4 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors resize-none"
                                rows={8}
                                placeholder="你的故事会显示在这里..."
                                value={inputText}
                                onChange={(e)=>{
                                    setInputText(e.target.value);
                                }}
                            >
        
                            </Textarea>
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
        </>
    );
}

export default SpeakPractice;