import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Eye, BarChart3, Network, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import LinkageChart from '@/components/charts/LinkageChart';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export default function ReportModal({ isOpen, onClose, data }: ReportModalProps) {
  const [activeTab, setActiveTab] = useState<'chart' | 'summary' | 'export'>('chart');

  const sampleData = {
    contacts: [
      { name: "Amit Verma", phone: "+919812345678", email: "amitv@example.com" },
      { name: "Unknown", phone: "+919876543210" },
      { name: "Unknown", phone: "+447911123456" },
      { name: "Unknown", phone: "+14155552671" }
    ],
    chats: [
      { from: "+919812345678", to: "+447911123456", timestamp: "2025-08-24T19:10:00Z", message: "Please verify my account at cryptox.com urgently." },
      { from: "+919812345678", to: "+919876543210", timestamp: "2025-08-21T10:15:00Z", message: "Hey, did you get the BTC address? It's bc1qw4sk0w37h29r45k39r0sa0jhz7edq5h7ty5mzp" },
      { from: "+919812345678", to: "+919812340000", timestamp: "2025-08-28T09:00:00Z", message: "Send the shipment tracking number ASAP." },
      { from: "+919876543210", to: "+919812345678", timestamp: "2025-08-21T10:17:00Z", message: "Yes, I will transfer 0.5 BTC tonight." },
      { from: "+14155552671", to: "+919876543210", timestamp: "2025-08-23T15:42:00Z", message: "Meeting confirmed at Connaught Place, 5PM. Don't forget the documents." }
    ],
    calls: [
      { from: "+447911123456", to: "+919876543210", timestamp: "2025-08-29T14:05:00Z", duration: 420 },
      { from: "+919812345678", to: "+14155552671", timestamp: "2025-08-25T22:11:00Z", duration: 600 },
      { from: "+14155552671", to: "+919812345678", timestamp: "2025-08-27T02:45:00Z", duration: 35 }
    ],
    transactions: [
      { from: "+919876543210", to: "+919812345678", amount: 0.5, currency: "BTC", timestamp: "2025-08-21T10:17:00Z" }
    ],
    notes: [
      { timestamp: "2025-08-30T08:00:00Z", content: "User had multiple communications with foreign numbers. Found BTC wallet address and reference to crypto exchange account." }
    ]
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-[95vw] h-[90vh] max-w-7xl glass elev rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-card/50">
            <div>
              <h2 className="text-2xl font-bold text-foreground/90">Forensic Report</h2>
              <p className="text-sm text-muted-foreground">Comprehensive analysis of communications and transactions</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 rounded-lg glass hover:bg-card/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center border-b border-border/50 bg-card/30">
            {[
              { id: 'chart', label: 'Network Chart', icon: Network },
              { id: 'summary', label: 'Summary', icon: BarChart3 },
              { id: 'export', label: 'Export', icon: Download }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2",
                  activeTab === tab.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-card/50"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'chart' && (
              <LinkageChart
                data={sampleData}
                isOpen={true}
                onClose={() => {}} // Don't close the modal, just the chart
              />
            )}

            {activeTab === 'summary' && (
              <div className="h-full overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Contacts Summary */}
                  <div className="glass elev rounded-xl p-6 hover-lift">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground/90">Contacts</h3>
                    </div>
                    <div className="space-y-3">
                      {sampleData.contacts.map((contact, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div>
                            <div className="font-medium text-foreground/90">{contact.name}</div>
                            <div className="text-sm text-muted-foreground">{contact.phone}</div>
                            {contact.email && (
                              <div className="text-sm text-muted-foreground">{contact.email}</div>
                            )}
                          </div>
                          <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {contact.name === 'Unknown' ? 'Unknown' : 'Known'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Communications Summary */}
                  <div className="glass elev rounded-xl p-6 hover-lift">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground/90">Communications</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 rounded-lg bg-blue-500/10">
                          <div className="text-2xl font-bold text-blue-500">{sampleData.chats.length}</div>
                          <div className="text-xs text-muted-foreground">Chats</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-purple-500/10">
                          <div className="text-2xl font-bold text-purple-500">{sampleData.calls.length}</div>
                          <div className="text-xs text-muted-foreground">Calls</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-red-500/10">
                          <div className="text-2xl font-bold text-red-500">{sampleData.transactions.length}</div>
                          <div className="text-xs text-muted-foreground">Transactions</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="glass elev rounded-xl p-6 hover-lift lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground/90">Recent Activity</h3>
                    </div>
                    <div className="space-y-3">
                      {[...sampleData.chats, ...sampleData.calls, ...sampleData.transactions]
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .slice(0, 10)
                        .map((activity, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <div className={`w-2 h-2 rounded-full ${
                              'message' in activity ? 'bg-blue-500' :
                              'duration' in activity ? 'bg-purple-500' : 'bg-red-500'
                            }`}></div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-foreground/90">
                                {('message' in activity && 'Chat') ||
                                 ('duration' in activity && 'Call') ||
                                 ('amount' in activity && 'Transaction')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {('message' in activity && activity.message.slice(0, 50) + '...') ||
                                 ('duration' in activity && `Duration: ${formatDuration(activity.duration)}`) ||
                                 ('amount' in activity && `${activity.amount} ${activity.currency}`)}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimestamp(activity.timestamp)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {sampleData.notes.length > 0 && (
                    <div className="glass elev rounded-xl p-6 hover-lift lg:col-span-2">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground/90">Investigation Notes</h3>
                      </div>
                      <div className="space-y-3">
                        {sampleData.notes.map((note, index) => (
                          <div key={index} className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <div className="text-sm text-foreground/90 mb-2">{note.content}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimestamp(note.timestamp)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="h-full overflow-y-auto p-6">
                <div className="max-w-2xl mx-auto">
                  <div className="glass elev rounded-xl p-6 hover-lift mb-6">
                    <h3 className="text-lg font-semibold text-foreground/90 mb-4">Export Options</h3>
                    <div className="space-y-4">
                      <button className="w-full flex items-center gap-3 p-4 rounded-lg glass hover:bg-card/50 transition-colors">
                        <Download className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <div className="font-medium text-foreground/90">PDF Report</div>
                          <div className="text-sm text-muted-foreground">Generate a comprehensive PDF report</div>
                        </div>
                      </button>
                      <button className="w-full flex items-center gap-3 p-4 rounded-lg glass hover:bg-card/50 transition-colors">
                        <Share2 className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <div className="font-medium text-foreground/90">Share Link</div>
                          <div className="text-sm text-muted-foreground">Create a shareable link to this report</div>
                        </div>
                      </button>
                      <button className="w-full flex items-center gap-3 p-4 rounded-lg glass hover:bg-card/50 transition-colors">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <div className="font-medium text-foreground/90">JSON Data</div>
                          <div className="text-sm text-muted-foreground">Download raw data in JSON format</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="glass elev rounded-xl p-6 hover-lift">
                    <h3 className="text-lg font-semibold text-foreground/90 mb-4">Report Metadata</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Generated:</span>
                        <span className="text-foreground/90">{new Date().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Contacts:</span>
                        <span className="text-foreground/90">{sampleData.contacts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Communications:</span>
                        <span className="text-foreground/90">
                          {sampleData.chats.length + sampleData.calls.length + sampleData.transactions.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Investigation Notes:</span>
                        <span className="text-foreground/90">{sampleData.notes.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
