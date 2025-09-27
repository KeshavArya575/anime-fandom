// components/UpdateCard.tsx
import { ChatBubbleOvalLeftIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';

type UpdateCardProps = {
  author: string;
  avatarUrl: string;
  time: string;
  children: React.ReactNode;
  likes: number;
  comments: number;
  shares: number;
};

export default function UpdateCard({ author, avatarUrl, time, children, likes, comments, shares }: UpdateCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-x-3">
        <img src={avatarUrl} alt={author} className="h-10 w-10 rounded-full bg-gray-50" />
        <div className="text-sm">
          <div className="font-semibold text-gray-900">{author}</div>
          <div className="text-gray-500">{time}</div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-700">
        {children}
      </div>
      <div className="mt-4 flex items-center justify-end gap-x-6 text-gray-500">
        <div className="flex items-center gap-x-1">
          <HeartIcon className="h-5 w-5" />
          <span className="text-xs">{likes}</span>
        </div>
        <div className="flex items-center gap-x-1">
          <ChatBubbleOvalLeftIcon className="h-5 w-5" />
          <span className="text-xs">{comments}</span>
        </div>
        <div className="flex items-center gap-x-1">
          <ShareIcon className="h-5 w-5" />
          <span className="text-xs">{shares}</span>
        </div>
      </div>
    </div>
  );
}