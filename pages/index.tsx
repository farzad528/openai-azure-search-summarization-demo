import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Header from "@/components/Header";
import { useState } from "react";
import Dropdown, { ExpertiseType } from "../components/Dropdown";
import LoadingDots from "@/components/LoadingDots";
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { PacmanLoader } from "react-spinners";

const inter = Inter({ subsets: ["latin"] });

interface SearchCaptions {
  text: string;
  highlights: string;
}
interface SearchResult {
  "@search.score": number;
  "@search.rerankerScore": number;
  "@search.captions": SearchCaptions[];
  title_en_lucene: string;
  text_en_lucene: string;
  id: string;
}

export default function Home() {
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [searchResultLoading, setSearchResultLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [summary, setSummary] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [expertise, setExpertise] = useState<ExpertiseType>("Expert");
  const [generatedSummaries, setGeneratedSummaries] = useState<String>("");

  const prompt =
    expertise === "Toddler"
      ? `Generate 2 summaries explained at a toddler comprehension level clearly labeled "1." and "2.". Make sure each generated summary is at max 20 words and base it on this context: ${summary}${
          summary.slice(-1) === "." ? "" : "."
        }`
      : `Generate 2 summaries explained at a ${expertise} comprehension level clearly labeled "1." and "2.". Make sure each generated summary is at least 20 words and at max 100 words and base them on this context: ${summary}${
          summary.slice(-1) === "." ? "" : "."
        }`;

  const search = searchQuery;

  const handleClear = () => {
    setSearchQuery("");
  };

  const getSearchResults = async (e: any) => {
    e.preventDefault();
    setSearchResults([]);
    setSearchResultLoading(true);

    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": `${process.env.API_KEY ?? ""}`,
      },
      body: JSON.stringify({
        search,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    let results = await response.json();
    console.log(results);
    setSearchResultLoading(false);
    setSearchResults(results.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!searchQuery || searchQuery.trim() === "" || searchQuery === "*") {
        alert("Please type something");
        return;
      }
      getSearchResults(e);
    }
  };

  const generateSummary = async (e: any) => {
    e.preventDefault();
    setGeneratedSummaries("");
    setSummaryLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": `${process.env.OPENAI_API_KEY ?? ""}`,
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    let answer = await response.json();
    setGeneratedSummaries(answer.choices[0].text);
    setSummaryLoading(false);
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
          <h1 className="text-center text-4xl my-3 font-bold text-slate-900">
            Generate instant summaries at any level for your docs
          </h1>
          <div className="flex w-full  mt-2">
            <div className="flex flex-col bg-gray-100 w-1/2">
              <div className="flex items-center justify-center rounded-lg  p-3 bg-white shadow-sm w-3/5">
                <MagnifyingGlassIcon width={20} className="text-gray-500" />
                <input
                  type="text"
                  className="bg-[#FFFFFFCC] focus:outline-0 w-full px-1"
                  placeholder={"Type a search query"}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {searchQuery && (
                  <XCircleIcon
                    width={20}
                    className="text-gray-500"
                    onClick={handleClear}
                  />
                )}
              </div>
              <div>
                {searchResultLoading ? (
                  <LoadingDots color="blue" style="large" />
                ) : (
                  <div>
                    {searchResults.map((searchResult: SearchResult) => {
                      return (
                        <div
                          key={searchResult.id}
                          className="flex flex-col items-start w-full border bg-white shadow-xl rounded-xl py-2 px-6 mt-2"
                        >
                          <p className="text-[#4F52B2] hover:underline hover:cursor-pointer text-lg">
                            {searchResult.title_en_lucene}
                          </p>
                          <span className="text-sm">
                            <p
                              dangerouslySetInnerHTML={{
                                __html:
                                  searchResult["@search.captions"][0].highlights
                                    .length === 0
                                    ? searchResult["@search.captions"][0].text
                                    : searchResult["@search.captions"][0]
                                        .highlights,
                              }}
                            />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col mx-2">
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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5 px-3 py-2"
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
              {!summaryLoading && (
                <button
                  className="bg-blue-500 rounded-xl text-white font-medium px-4 py-2 mt-8 hover:bg-blue-700 w-full transition duration-250"
                  onClick={(e) => generateSummary(e)}
                >
                  Generate your summary &rarr;
                </button>
              )}
              {summaryLoading && (
                <button
                  className="bg-blue-500 rounded-xl text-white font-medium px-4 py-2 mt-8 hover:bg-blue-700 w-full transition duration-250"
                  disabled
                >
                  {/* <LoadingDots color="white" style="large" /> */}
                  <PacmanLoader color="yellow"  />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-10 my-10">
            {generatedSummaries && (
              <>
                <div>
                  <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                    Your generated summaries
                  </h2>
                </div>
                <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                  {generatedSummaries
                    .substring(generatedSummaries.indexOf("1") + 3)
                    .split("2.")
                    .map((generatedSummary) => {
                      return (
                        <div
                          className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                          // onClick={() => {
                          //   navigator.clipboard.writeText(generatedSummary);
                          //   toast("Bio copied to clipboard", {
                          //     icon: "✂️",
                          //   });
                          // }}
                          key={generatedSummary}
                        >
                          <p>{generatedSummary}</p>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
