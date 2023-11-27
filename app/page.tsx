import Answer from "./components/Answer";
import Question from "./components/Question";
import Timer from "./components/Timer";

import { promises as fs} from 'fs';

type EnglishClass = {
  Class: string;
  "Letters Given": string;
  Words: string;
  Reward: string;
};

export type ApiResponse = {
  items: EnglishClass[];
};

export default async function Home() {

  const file = await fs.readFile(process.cwd() + '/app/classes.json', 'utf8');
  const data: ApiResponse = JSON.parse(file);

  return (
    <main 
      className="flex flex-col gap-6 min-h-screen">
        <Timer />
      <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 bg-pink-100">
        <Answer items={data} />
        <Question items={data} />
      </div>
    </main>
  )
}
