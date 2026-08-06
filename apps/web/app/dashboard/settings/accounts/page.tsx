'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Code, Grid, Laptop, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function ConnectedAccountsPage() {
  const [googleConnected, setGoogleConnected] = useState<boolean>(true);
  const [githubConnected, setGithubConnected] = useState<boolean>(true);
  const [msConnected, setMsConnected] = useState<boolean>(false);
  const [appleConnected, setAppleConnected] = useState<boolean>(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Header */}
      <div className="space-y-1 border-b border-gray-100 pb-4">
        <Link href="/dashboard/settings" className="text-[12px] font-mono text-gray-500 hover:text-gray-900 flex items-center space-x-1 mb-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Settings / Connected Accounts</span>
        </Link>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-gray-950 font-sans leading-tight">
          Data Sources
        </h1>
        <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
          Connect your digital accounts to feed the Presence Engine. PersonaIQ utilizes academic-grade privacy protocols; your raw data is never exposed.
        </p>
      </div>

      {/* Account Cards List */}
      <div className="space-y-3.5">
        
        {/* Card 1: Google Workspace */}
        <div className="p-4 bg-white border border-gray-200 rounded-[18px] shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-950 font-sans leading-tight">
                Google Workspace
              </h3>
              {googleConnected ? (
                <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-500 pt-0.5">
                  <span className="text-red-600 font-bold">● CONNECTED</span>
                  <span>user@mit.edu</span>
                </div>
              ) : (
                <span className="text-[11px] font-mono text-gray-400 block pt-0.5">
                  ● NOT CONNECTED
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setGoogleConnected(!googleConnected)}
            className={`px-4 py-1.5 rounded-[8px] font-bold text-[12.5px] transition-all shrink-0 ${
              googleConnected
                ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
            }`}
          >
            {googleConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        {/* Card 2: GitHub */}
        <div className="p-4 bg-white border border-gray-200 rounded-[18px] shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-950 font-sans leading-tight">
                GitHub
              </h3>
              {githubConnected ? (
                <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-500 pt-0.5">
                  <span className="text-red-600 font-bold">● CONNECTED</span>
                  <span>@dev-persona</span>
                </div>
              ) : (
                <span className="text-[11px] font-mono text-gray-400 block pt-0.5">
                  ● NOT CONNECTED
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setGithubConnected(!githubConnected)}
            className={`px-4 py-1.5 rounded-[8px] font-bold text-[12.5px] transition-all shrink-0 ${
              githubConnected
                ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
            }`}
          >
            {githubConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        {/* Card 3: Microsoft 365 */}
        <div className="p-4 bg-white border border-gray-200 rounded-[18px] shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-950 font-sans leading-tight">
                Microsoft 365
              </h3>
              {msConnected ? (
                <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-500 pt-0.5">
                  <span className="text-red-600 font-bold">● CONNECTED</span>
                  <span>user@outlook.com</span>
                </div>
              ) : (
                <span className="text-[11px] font-mono text-gray-400 block pt-0.5">
                  ● NOT CONNECTED
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMsConnected(!msConnected)}
            className={`px-4 py-1.5 rounded-[8px] font-bold text-[12.5px] transition-all shrink-0 ${
              msConnected
                ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
            }`}
          >
            {msConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        {/* Card 4: Apple ID */}
        <div className="p-4 bg-white border border-gray-200 rounded-[18px] shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-950 font-sans leading-tight">
                Apple ID
              </h3>
              {appleConnected ? (
                <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-500 pt-0.5">
                  <span className="text-red-600 font-bold">● CONNECTED</span>
                  <span>user@icloud.com</span>
                </div>
              ) : (
                <span className="text-[11px] font-mono text-gray-400 block pt-0.5">
                  ● NOT CONNECTED
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAppleConnected(!appleConnected)}
            className={`px-4 py-1.5 rounded-[8px] font-bold text-[12.5px] transition-all shrink-0 ${
              appleConnected
                ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
            }`}
          >
            {appleConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

      </div>

      {/* Security Architecture Card */}
      <div className="bg-gray-50/70 border border-gray-200 rounded-[20px] p-5 space-y-2 mt-4">
        <span className="text-[9.5px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
          ANALYSIS
        </span>

        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[14.5px] font-bold text-gray-950 font-sans">
              Secure Data Architecture
            </h4>
            <p className="text-[12.5px] text-gray-600 font-normal leading-relaxed">
              OAuth tokens are encrypted at rest using AES-256. PersonaIQ operates on a read-only basis and does not index personal communications or private repository code.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
