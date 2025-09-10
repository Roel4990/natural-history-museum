'use client';


import QuizContent from "@/app/quiz/QuizContent";
import React, {Suspense} from "react";

export default function QuizPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QuizContent /> {/* client component */}
        </Suspense>
    );
}
