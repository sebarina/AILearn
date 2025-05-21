export const runtime = 'edge';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    try {
        const {imageUrl} = req.body;
        const response = await fetch(`https://api.coze.cn/v1/workflow/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':"Bearer pat_GvOP7slpNQo4YZ89NaMFvzsDcVU9Yj5AJsIbYPysBRD5l6O9iceF6sq6G5WLV1Me"
            },
            body: JSON.stringify({
                "app_id": "7506692414422171698",
				"workflow_id":"7506711692366676031",
				"parameters":{
					"input":imageUrl
				}
            })
         })
         const data = await response.json()
         if (data.code == 0) {
            return res.status(200).json({"code":200, message: '成功', "data":data.data});
         } else {
            return res.status(200).json({ code:500, message: '请求失败' });
         }

        

    } catch (error) {
        console.log(error);
        return res.status(200).json({ code:500, message: '请求失败' });
    }    
}