import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="flex flex-col max-w-5xl mx-auto py-2 min-h-screen">
      <Head>
        <title>OpenAI Semantic Answers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
          Generate instance answers over your index
        </h1>
      </main>
    </div>
  );
}
