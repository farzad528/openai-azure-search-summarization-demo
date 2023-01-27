import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Header from "@/components/Header";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [generatedAnswers, setGerneatedAnswers] = useState<String>("");

  return (
    <div className="bg-gray-100">
      <Header />
      <div className="flex flex-col max-w-5xl mx-auto py-2 min-h-screen">
        <Head>
          <title>OpenAI Semantic Answers</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1 className="text-4xl max-w-2xl font-bold text-slate-900">
            Generate instance answers over your index
          </h1>
          <div className="flex w-full justify-between items-center mt-2">
            <div className="bg-gray-100 w-1/2">search cards here</div>
            <div className="flex flex-col">
              <div className="text-slate">
                <p className="text-left font-medium">
                  Copy the content of your top 2 documents &nbsp;
                  <span className="text-slate-500">
                    (or from anywhere else)
                  </span>
                </p>
              </div>
              <textarea
                // value={bio}
                // onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
                placeholder={"e.g. this is an example prompt to enter"}
              />
              <button
                className="bg-blue-500 rounded-xl text-white font-medium px-4 py-2 mt-8 hover:bg-blue-700 w-full transition duration-250"
                // onClick={(e) => generateBio(e)}
              >
                Generate answer &rarr;
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
