import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="flex max-w-lg mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>OpenAI Semantic Answers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-slate-500 font-semibold">Hey, lets build a OpenAI Semantic Answer 2.0</h1>
      <Header  />
      <main>
        <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
          Generate instance answers over your index
        </h1>
      </main>
    </div>
  );
}
