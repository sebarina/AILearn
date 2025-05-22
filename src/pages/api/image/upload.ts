import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
export const runtime = 'edge';
const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});


export default async function handler(req:any) {
    
        const form = await req.formData();
        const file = form.get('file') as File | null;

        if (!file || typeof file === 'string') {
            return new Response(JSON.stringify({ message: '未找到文件' }), { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const key = `uploads/${Date.now()}-${file.name}`;

        try {
            await s3.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET!,
                Key: key,
                Body: buffer,
                ContentType: file.type,
                ACL: 'public-read', // 可选：设置为公开访问
            })
            );

            // const publicUrl = `${process.env.R2_ENDPOINT!.replace(/^https?:\/\//, 'https://')}/${process.env.R2_BUCKET}/${key}`;
            const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${key}`;
            return new Response(JSON.stringify({code:200, message: '上传成功', data:{url: publicUrl}}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            });
        

        } catch (error) {
            console.log(error);
            return new Response(JSON.stringify({"code":501, message: '上传失败'}), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
            });
        }    
}