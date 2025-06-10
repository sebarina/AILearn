export const runtime = 'edge';

export default async function handler(req:any) {
    
    try {
        const body = await req.json();
        const text = body.text;
       
        const response = await fetch(`https://api.coze.cn/v1/workflow/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':"Bearer pat_FETIki20RxJrejzzBlzgh8sMQmwAzYqnSEu8uFeZppgcBUA1CoQ5DEYxyzoGhbn0"
            },
            body: JSON.stringify({
                "app_id": "7506692414422171698",
				"workflow_id":"7506711692366676031",
				"parameters":{
					"input":text,
            
				}
            })
         })
         const data = await response.json()
         console.log(data);
         if (data.code == 0) {
            return new Response(JSON.stringify({"code":200, message: '成功', "data":data.data}), {
                headers: { 'Content-Type': 'application/json' },
            });
         } else {
            
            return new Response(JSON.stringify({"code":500, message: '请求失败'}), {
                headers: { 'Content-Type': 'application/json' },
            });
           
         }

        

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({"code":501, message: '请求异常'}), {
                headers: { 'Content-Type': 'application/json' },
        });
    }    
}