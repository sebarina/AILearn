import { any } from "prop-types";

export const showLoading = (message:string):void =>{
    // Create loading overlay
    const existingOverlay = document.getElementById('loading-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'fixed flex h-screen inset-0 bg-black/50 z-50 flex items-center justify-center';
    
    const spinner = document.createElement('div');
    spinner.className = 'bg-white p-5 rounded-lg flex flex-col items-center';
    
    const spinnerAnimation = document.createElement('div');
    spinnerAnimation.className = 'mb-2 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500';
    
    const text = document.createElement('p');
    text.className = 'text-sm';
    text.textContent = message || '加载中...';
    
    spinner.appendChild(spinnerAnimation);
    spinner.appendChild(text);
    overlay.appendChild(spinner);
    
    document.body.appendChild(overlay);
};

export const hideLoading = ()=> {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.remove();
    }
};

export interface Person {
    id: number;
    name: string;
    gender: string;
    birthday: string;
    birth_time: string;
    province:string;
    city:string;
    relationship: string;
};

export const getStringValueOfObject = (obj: any): string => {
    if(Array.isArray(any)){
        return obj.map((item:any) => getStringValueOfObject(item)).join(", ");
    }  
    if (typeof obj === 'string' && obj !== null) {
        return obj;
    }
    if (typeof obj === 'number' && obj !== null) {
        return obj.toString();
    }
    if (typeof obj === 'boolean' && obj !== null) {
        return obj ? '是' : '否';
    }
    if (typeof obj === 'object' && obj !== null) {
        return Object.entries(obj).map(([key, value]) => {
            return `${key}: ${getStringValueOfObject(value)}`;
        }).join("; ");
    }
    return "";
}

export const getImageAnalysis = async (imageUrl:string, desc:string) => {
    showLoading("正在分析...");
    try{
        const response = await fetch(`/api/image/analysis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageUrl: imageUrl,
                description:desc
            })
         })
         const data = await response.json()
         hideLoading();
         console.log(data)
         if(data.code == 200){
            const dataStr = data.data
            const dataJson = JSON.parse(dataStr);
            const ouputString = dataJson["output"]
            return ouputString
         }else{
            return null
         }

    } catch {
        console.log("exception")
        hideLoading();
        return null;
    }
     
}