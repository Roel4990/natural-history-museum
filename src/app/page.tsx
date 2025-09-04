'use client';

import {useRouter} from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <main className="flex justify-center items-center min-h-screen bg-white">
            <div
                className="w-full max-w-[480px] mx-auto"
                onClick={() => router.push('/map/1')}
            >
                <img
                    src="/start_image.jpg"
                    alt="시작 이미지"
                    className="w-full h-auto object-contain"
                />
            </div>
        </main>
    );
}
