import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Header from "@/components/Header";
import { useState } from "react";
import Dropdown, { ExpertiseType } from "../components/Dropdown";
import LoadingDots from "@/components/LoadingDots";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [expertise, setExpertise] = useState<ExpertiseType>("Expert");
  const [generatedSummaries, setGeneratedSummaries] = useState<String>("");

  const prompt =
    expertise === "Toddler"
      ? `Generate 2 summaries explained at a toddler level of the summary clearly labeled "1." and "2.". Make sure there is no complicated vocabulary and it is simple and concise to understand. Make sure each generated summary is at max 20 words and base it on this context: ${summary}${
          summary.slice(-1) === "." ? "" : "."
        }`
      : `Generate 2 ${expertise} twitter summarys with no hashtags and clearly labeled "1." and "2.". Make sure each generated summary is at least 20 words and at max 500 words and base them on this context: ${summary}${
          summary.slice(-1) === "." ? "" : "."
        }`;

  const generateSummary = async (e: any) => {
    e.preventDefault();
    setGeneratedSummaries("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedSummaries((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

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
                  1) Copy the content of your top 2 documents &nbsp;
                  <span className="text-slate-500">
                    (or from anywhere else)
                  </span>
                </p>
              </div>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
                placeholder={"e.g. this is an example prompt to enter"}
              />
              <div className="flex mb-5 items-center space-x-3">
                <p className="text-left font-medium">
                  2) Select your expertise
                </p>
              </div>
              <div className="block">
                <Dropdown
                  expertise={expertise}
                  setExpertise={(newExpertise) => setExpertise(newExpertise)}
                />
              </div>
              {!loading && (
                <button
                  className="bg-blue-500 rounded-xl text-white font-medium px-4 py-2 mt-8 hover:bg-blue-700 w-full transition duration-250"
                  onClick={(e) => generateSummary(e)}
                >
                  Generate your summary &rarr;
                </button>
              )}
              {loading && (
                <button
                  className="bg-blue-500 rounded-xl text-white font-medium px-4 py-2 mt-8 hover:bg-blue-700 w-full transition duration-250"
                  disabled
                >
                  <LoadingDots color="white" style="large" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
