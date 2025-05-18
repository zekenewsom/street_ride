import { encodeWaypoints } from "../utils/shareUtils";
import Modal from "./Modal";
import { useState } from "react";

export default function SharePanel({ waypoints }) {
  const baseUrl = window.location.origin + window.location.pathname;
  const param = encodeWaypoints(waypoints);
  const shareUrl = `${baseUrl}?route=${encodeURIComponent(param)}`;
  const embedCode = `<iframe width="900" height="600" src="${shareUrl}" frameborder="0"></iframe>`;

  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Share or embed route"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/></svg>
        Share / Embed
      </button>
      <Modal open={show} onClose={() => setShow(false)}>
        <div className="p-2 md:p-4 font-sans">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/></svg>
            Share or Embed
          </h2>
          <div className="mb-5">
            <div className="mb-1 text-sm font-semibold text-gray-700">Shareable link:</div>
            <input className="w-full p-2 bg-gray-100 rounded-lg font-mono text-base mb-2" readOnly value={shareUrl} />
          </div>
          <div>
            <div className="mb-1 text-sm font-semibold text-gray-700">Embed code:</div>
            <textarea
              className="w-full p-2 bg-gray-100 rounded-lg font-mono text-base"
              readOnly
              rows={3}
              value={embedCode}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
