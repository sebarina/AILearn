"use client"

import React from "react";
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Logo from "/public/images/logos/logo.svg";
import Image from "next/image";

const gradientStyle = {
  background: "linear-gradient(45deg, rgb(238, 119, 82,0.2), rgb(231, 60, 126,0.2), rgb(35, 166, 213,0.2), rgb(35, 213, 171,0.2))",
  backgroundSize: "400% 400%",
  animation: "gradient 15s ease infinite",
  height: "100vh",
};

const BoxedLogin = () => {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState(1) // 1: 输入手机号, 2: 输入验证码
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')
  interface LoginForm {
    code: string;
  }
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  
  // 发送验证码
  const sendSMSCode = async () => {
    setError('')
    try {
      const response = await fetch('/api/sms/send-sms-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"phone": phone})
      })
      const responseData = await response.json();
      
      if (responseData.code != 200) {
        setError('发送验证码失败');
        return
      }

      setStep(2)
      startCountdown()
    } catch (err) {
      setError('发送验证码失败');
    }
  }
  
  // 倒计时
  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) clearInterval(timer)
        return prev - 1
      })
    }, 1000)
  }
  
  // 验证登录
  const verifyLogin = async (data: { code: any; }) => {
    setError('')
    try {
      const response = await fetch('/api/sms/verify-sms-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({phone: phone,code: data.code})
      })
      const responseData = await response.json()
      if (responseData.code != 200) {
        setError('登录失败');
        return
      }
      // 跳转到首页
      router.push('/')
    } catch (err) {
      console.log(err);
      setError('登录失败');
    }
  }

  return (
    <div style={gradientStyle} className="relative overflow-hidden h-screen">
      <div className="flex h-full justify-center items-center px-4">
        <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-6 w-full md:w-96 border-none">
          <div className="flex flex-col gap-2 p-0 w-full">
            <div className="mx-auto mb-4">
              <div className="flex items-center">
                  <Image src={Logo} width={40} alt="真爱密盒" className="h-10 mr-2"/>
                  <h1 className="text-primary font-bold text-xl">真爱密盒<span className="text-sm ml-1 font-normal">家庭版</span></h1>
              </div>
            </div>
            <h1 className="text-xl font-bold mb-6">手机号登录</h1>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {step === 1 ? (
        <div>
          <div className="mb-4">
            <label className="block mb-2">手机号</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入11位手机号"
              maxLength={11}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={sendSMSCode}
            disabled={!/^1[3-9]\d{9}$/.test(phone)}
            className="w-full bg-blue-500 text-white p-4 rounded disabled:bg-gray-300"
          >
            获取验证码
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(verifyLogin)}>
          <div className="mb-4">
            <p className="mb-2">验证码已发送至 {phone}</p>
            <input
              type="text"
              {...register('code', { 
                required: '请输入验证码',
                pattern: { value: /^\d{6}$/, message: '验证码为6位数字' }
              })}
              placeholder="请输入6位验证码"
              maxLength={6}
              className="w-full p-2 border rounded"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code?.message?.toString()}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-4 rounded mb-4"
          >
            登录
          </button>
          
          <button
            type="button"
            onClick={sendSMSCode}
            disabled={countdown > 0}
            className="w-full text-blue-500 p-4 rounded border border-blue-500 disabled:text-gray-400 disabled:border-gray-400"
          >
            {countdown > 0 ? `${countdown}秒后重新获取` : '重新获取验证码'}
          </button>
        </form>
      )}
            
            
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default BoxedLogin;
