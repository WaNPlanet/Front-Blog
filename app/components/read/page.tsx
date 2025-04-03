"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Comment {
  id: string;
  text: string;
  replies: Comment[];
  voiceNote?: string | null;
  image?: string | null;
  parentId?: string | null;
}

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [voiceNote, setVoiceNote] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
  };

  const addReplyToComment = (comments: Comment[], targetId: string, newReply: Comment): Comment[] => {
    return comments.map(comment => {
      if (comment.id === targetId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        };
      }
      return {
        ...comment,
        replies: addReplyToComment(comment.replies, targetId, newReply)
      };
    });
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() || recordedAudio || image) {
      const newEntry: Comment = {
        id: generateId(),
        text: newComment,
        replies: [],
        voiceNote: recordedAudio,
        image: image ? URL.createObjectURL(image) : null,
        parentId: replyingTo
      };

      if (replyingTo !== null) {
        setComments(prevComments => addReplyToComment(prevComments, replyingTo, newEntry));
      } else {
        setComments(prevComments => [...prevComments, newEntry]);
      }

      setNewComment("");
      setReplyingTo(null);
      setRecordedAudio(null);
      setImage(null);
    }
  };

  const handleReplySubmit = (parentId: string) => {
    if (replyText.trim() || recordedAudio || image) {
      const newReply: Comment = {
        id: generateId(),
        text: replyText,
        replies: [],
        voiceNote: recordedAudio,
        image: image ? URL.createObjectURL(image) : null,
        parentId: parentId
      };

      setComments(prevComments => addReplyToComment(prevComments, parentId, newReply));
      
      setReplyText("");
      setReplyingTo(null);
      setRecordedAudio(null);
      setImage(null);
    }
  };

  useEffect(() => {
    return () => {
      if (recordedAudio) URL.revokeObjectURL(recordedAudio);
      comments.forEach(comment => {
        if (comment.voiceNote) URL.revokeObjectURL(comment.voiceNote);
        if (comment.image) URL.revokeObjectURL(comment.image);
      });
    };
  }, [recordedAudio, comments]);

  const CommentItem = ({ comment, depth = 0 }: {
    comment: Comment;
    depth?: number;
  }) => {
    return (
      <div className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="flex space-x-3 py-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {comment.text.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-gray-800">{comment.text}</p>
              
              {comment.voiceNote && (
                <audio controls src={comment.voiceNote} className="mt-2 w-full" />
              )}
              
              {comment.image && (
                <div className="mt-2">
                  <Image
                    src={comment.image}
                    alt="comment image"
                    width={200}
                    height={200}
                    className="rounded-lg shadow-md border"
                  />
                </div>
              )}
            </div>
            
            <button
              className="text-blue-500 text-sm mt-1 hover:underline"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              Reply
            </button>
            
            {/* Reply input field that appears when replying to this comment */}
            {replyingTo === comment.id && (
              <div className="mt-3">
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows={2}
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                
                <div className="flex items-center space-x-2 mt-2">
                  {recording ? (
                    <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm" onClick={stopRecording}>
                      Stop
                    </button>
                  ) : (
                    <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm" onClick={startRecording}>
                      Record
                    </button>
                  )}
                </div>
                {recordedAudio && (
                  <audio controls src={recordedAudio} className="mt-1" />
                )}

                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImage(e.target.files?.[0] || null)} 
                  className="mt-1 text-sm"
                />
                
                <div className="flex space-x-2 mt-2">
                  <button 
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm" 
                    onClick={() => handleReplySubmit(comment.id)}
                  >
                    Post Reply
                  </button>
                  <button 
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm" 
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {/* Nested replies */}
            {comment.replies.length > 0 && (
              <div className="mt-3 space-y-3">
                {comment.replies.map(reply => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 text-black font-sans min-h-screen">
      {/* Navbar */}
      <nav className="shadow-md py-4 px-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">MySite</Link>
        <ul className="flex space-x-6">
          <li><Link href="/" className="text-gray-600 hover:text-black">Home</Link></li>
          <li><Link href="/components/category" className="text-gray-600 hover:text-black">Categories</Link></li>
          <li><Link href="/blog" className="text-gray-600 hover:text-black">Blog</Link></li>
          <li><Link href="/contact" className="text-gray-600 hover:text-black">Contact</Link></li>
        </ul>
      </nav>

      {/* Page Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Main Featured News */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-4xl font-bold">Today's Top Story</h1>
          <h2 className="text-xl font-semibold">60 Classic Cars Found in a Barn Go Up for Auction</h2>
          <p className="text-gray-700">By Jenny Preston • 22 May 2022</p>
          <Image 
            src="/1.webp" 
            alt="top news" 
            width={800} 
            height={500} 
            className="rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105" 
          />
          <p className="text-gray-800">
            These hidden gems, found in an old barn, are making waves in the auction world. Car enthusiasts from all over the world are
            flocking to get a glimpse of these vintage beauties, some of which date back to the 1950s. Experts believe that the auction
            could fetch millions of dollars, as collectors eagerly bid for a piece of automotive history.
          </p>
          <p className="text-gray-800 mt-2">
            Many of the vehicles have been well-preserved, with their original paintwork and interiors intact. Others, however, will require
            significant restoration. "This is a once-in-a-lifetime find," says auto historian Mark Daniels. "It's incredible to see so many
            classic cars in one place."
          </p>
        </div>

        {/* Sidebar (More News + Comments) */}
        <div className="border-l pl-6 border-gray-400 flex flex-col space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">More News</h3>
            {Array(5).fill(null).map((_, index) => (
              <div 
                key={index} 
                className="border-b py-3 hover:bg-gray-200 cursor-pointer transition-all duration-300 flex justify-between items-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div>
                  <h2 className="text-md font-bold">A sculpture of Laocoön was vandalized...</h2>
                  <p className="text-gray-600">By Kyere • Travel</p>
                </div>
                {hoveredIndex === index && (
                  <Image src="/1.webp" alt="news preview" width={100} height={70} className="rounded-lg" />
                )}
              </div>
            ))}
          </div>

          {/* Main Comment Input */}
          <div className="shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            
            <textarea
              className="w-full p-2 border rounded-lg"
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>

            <div className="flex items-center space-x-2 mt-2">
              {recording ? (
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg" onClick={stopRecording}>
                  Stop Recording
                </button>
              ) : (
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg" onClick={startRecording}>
                  Record Voice Note
                </button>
              )}
            </div>
            {recordedAudio && (
              <audio controls src={recordedAudio} className="mt-2" />
            )}

            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImage(e.target.files?.[0] || null)} 
              className="mt-2"
            />
            
            <button 
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg" 
              onClick={handleCommentSubmit}
            >
              Post Comment
            </button>

            {/* Comments List */}
            <div className="mt-6 space-y-4">
              {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Breaking News Marquee */}
      <div className="bg-gray-300 p-2 text-center text-sm mt-6">
        <marquee>
          🚨 Breaking News: Major tech breakthrough • Stock market sees record highs • New space mission announced
        </marquee>
      </div>
    </div>
  );
}