import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageSquare, CreditCard, FileText, Users, ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contact {
  name: string;
  phone: string;
  email?: string;
}

interface Chat {
  from: string;
  to: string;
  timestamp: string;
  message: string;
}

interface Call {
  from: string;
  to: string;
  timestamp: string;
  duration: number;
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
  currency: string;
  timestamp: string;
}

interface Note {
  timestamp: string;
  content: string;
}

interface LinkageData {
  contacts: Contact[];
  chats: Chat[];
  calls: Call[];
  transactions: Transaction[];
  notes: Note[];
}

interface LinkageChartProps {
  data: LinkageData;
  isOpen: boolean;
  onClose: () => void;
}

interface Node {
  id: string;
  type: 'contact' | 'phone';
  name: string;
  phone: string;
  email?: string;
  x: number;
  y: number;
  connections: number;
}

interface Link {
  source: string;
  target: string;
  type: 'chat' | 'call' | 'transaction';
  weight: number;
  data: any;
}

export default function LinkageChart({ data, isOpen, onClose }: LinkageChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredLink, setHoveredLink] = useState<Link | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'chats' | 'calls' | 'transactions'>('all');

  // Process data to create nodes and links
  const { nodes, links } = React.useMemo(() => {
    const nodeMap = new Map<string, Node>();
    const linkList: Link[] = [];

    // Create nodes from contacts
    data.contacts.forEach(contact => {
      nodeMap.set(contact.phone, {
        id: contact.phone,
        type: 'contact',
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        x: 0,
        y: 0,
        connections: 0
      });
    });

    // Process chats
    if (viewMode === 'all' || viewMode === 'chats') {
      data.chats.forEach(chat => {
        // Ensure both nodes exist
        if (!nodeMap.has(chat.from)) {
          nodeMap.set(chat.from, {
            id: chat.from,
            type: 'phone',
            name: 'Unknown',
            phone: chat.from,
            x: 0,
            y: 0,
            connections: 0
          });
        }
        if (!nodeMap.has(chat.to)) {
          nodeMap.set(chat.to, {
            id: chat.to,
            type: 'phone',
            name: 'Unknown',
            phone: chat.to,
            x: 0,
            y: 0,
            connections: 0
          });
        }

        linkList.push({
          source: chat.from,
          target: chat.to,
          type: 'chat',
          weight: 1,
          data: chat
        });

        nodeMap.get(chat.from)!.connections++;
        nodeMap.get(chat.to)!.connections++;
      });
    }

    // Process calls
    if (viewMode === 'all' || viewMode === 'calls') {
      data.calls.forEach(call => {
        if (!nodeMap.has(call.from)) {
          nodeMap.set(call.from, {
            id: call.from,
            type: 'phone',
            name: 'Unknown',
            phone: call.from,
            x: 0,
            y: 0,
            connections: 0
          });
        }
        if (!nodeMap.has(call.to)) {
          nodeMap.set(call.to, {
            id: call.to,
            type: 'phone',
            name: 'Unknown',
            phone: call.to,
            x: 0,
            y: 0,
            connections: 0
          });
        }

        linkList.push({
          source: call.from,
          target: call.to,
          type: 'call',
          weight: call.duration / 100, // Normalize duration
          data: call
        });

        nodeMap.get(call.from)!.connections++;
        nodeMap.get(call.to)!.connections++;
      });
    }

    // Process transactions
    if (viewMode === 'all' || viewMode === 'transactions') {
      data.transactions.forEach(transaction => {
        if (!nodeMap.has(transaction.from)) {
          nodeMap.set(transaction.from, {
            id: transaction.from,
            type: 'phone',
            name: 'Unknown',
            phone: transaction.from,
            x: 0,
            y: 0,
            connections: 0
          });
        }
        if (!nodeMap.has(transaction.to)) {
          nodeMap.set(transaction.to, {
            id: transaction.to,
            type: 'phone',
            name: 'Unknown',
            phone: transaction.to,
            x: 0,
            y: 0,
            connections: 0
          });
        }

        linkList.push({
          source: transaction.from,
          target: transaction.to,
          type: 'transaction',
          weight: transaction.amount,
          data: transaction
        });

        nodeMap.get(transaction.from)!.connections++;
        nodeMap.get(transaction.to)!.connections++;
      });
    }

    // Simple force-directed layout
    const nodeArray = Array.from(nodeMap.values());
    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    nodeArray.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / nodeArray.length;
      node.x = centerX + radius * Math.cos(angle);
      node.y = centerY + radius * Math.sin(angle);
    });

    return { nodes: nodeArray, links: linkList };
  }, [data, viewMode]);

  const getNodeColor = (node: Node) => {
    if (node.type === 'contact') {
      return node.name === 'Unknown' ? '#f59e0b' : '#10b981';
    }
    return '#6b7280';
  };

  const getLinkColor = (link: Link) => {
    switch (link.type) {
      case 'chat': return '#3b82f6';
      case 'call': return '#8b5cf6';
      case 'transaction': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLinkStrokeWidth = (link: Link) => {
    return Math.max(1, Math.min(5, link.weight));
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
              <h2 className="text-2xl font-bold text-foreground/90">Linkage Analysis</h2>
              <p className="text-sm text-muted-foreground">Interactive network visualization of communications and transactions</p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Selector */}
              <div className="flex items-center gap-1 glass rounded-lg p-1">
                {(['all', 'chats', 'calls', 'transactions'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                      viewMode === mode
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    )}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg glass hover:bg-card/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(100%-5rem)]">
            {/* Main Chart Area */}
            <div className="flex-1 relative">
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                className="bg-gradient-to-br from-background/50 via-muted/10 to-background/30"
              >
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--muted-foreground)/0.1)" strokeWidth="1"/>
                  </pattern>
                  <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(var(--primary)/0.1)" />
                    <stop offset="100%" stopColor="hsl(var(--primary)/0.02)" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <rect width="100%" height="100%" fill="url(#centerGlow)" />
                {/* Links */}
                {links.map((link, index) => {
                  const sourceNode = nodes.find(n => n.id === link.source);
                  const targetNode = nodes.find(n => n.id === link.target);
                  if (!sourceNode || !targetNode) return null;

                  return (
                    <g key={index}>
                      {/* Glow effect */}
                      <motion.line
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.3 }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={getLinkColor(link)}
                        strokeWidth={getLinkStrokeWidth(link) + 4}
                        strokeOpacity={0.2}
                        filter="blur(2px)"
                        className="pointer-events-none"
                      />
                      {/* Main line */}
                      <motion.line
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.8 }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={getLinkColor(link)}
                        strokeWidth={getLinkStrokeWidth(link)}
                        strokeOpacity={0.7}
                        className="cursor-pointer transition-all duration-200 hover:stroke-opacity-100"
                        onMouseEnter={() => setHoveredLink(link)}
                        onMouseLeave={() => setHoveredLink(null)}
                      />
                      {/* Animated dots */}
                      <motion.circle
                        initial={{ r: 0, opacity: 0 }}
                        animate={{ r: 3, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                        cx={sourceNode.x}
                        cy={sourceNode.y}
                        fill={getLinkColor(link)}
                        className="pointer-events-none"
                      />
                      <motion.circle
                        initial={{ r: 0, opacity: 0 }}
                        animate={{ r: 3, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                        cx={targetNode.x}
                        cy={targetNode.y}
                        fill={getLinkColor(link)}
                        className="pointer-events-none"
                      />
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node, index) => (
                  <motion.g
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    className="cursor-pointer"
                    onClick={() => setSelectedNode(node)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Glow effect */}
                    <motion.circle
                      initial={{ r: 0, opacity: 0 }}
                      animate={{ r: Math.max(12, Math.min(24, 12 + node.connections * 2)), opacity: 0.3 }}
                      transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
                      cx={node.x}
                      cy={node.y}
                      fill={getNodeColor(node)}
                      filter="blur(4px)"
                      className="pointer-events-none"
                    />
                    {/* Main node */}
                    <motion.circle
                      initial={{ r: 0 }}
                      animate={{ r: Math.max(8, Math.min(20, 8 + node.connections * 2)) }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      cx={node.x}
                      cy={node.y}
                      fill={getNodeColor(node)}
                      stroke="white"
                      strokeWidth={2}
                      className="transition-all duration-200 hover:stroke-2"
                    />
                    {/* Connection count */}
                    <motion.text
                      initial={{ opacity: 0, y: node.y + 8 }}
                      animate={{ opacity: 1, y: node.y + 4 }}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.4 }}
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      className="text-xs font-bold fill-white pointer-events-none drop-shadow-sm"
                    >
                      {node.connections}
                    </motion.text>
                    {/* Node label */}
                    <motion.text
                      initial={{ opacity: 0, y: node.y - 15 }}
                      animate={{ opacity: 0.8, y: node.y - 12 }}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.6 }}
                      x={node.x}
                      y={node.y - 12}
                      textAnchor="middle"
                      className="text-xs font-medium fill-foreground/80 pointer-events-none"
                    >
                      {node.name === 'Unknown' ? '?' : node.name.split(' ')[0]}
                    </motion.text>
                  </motion.g>
                ))}
              </svg>

              {/* Legend */}
              <div className="absolute top-4 left-4 glass elev rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground/90 mb-3">Legend</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-muted-foreground">Known Contact</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-muted-foreground">Unknown Contact</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-muted-foreground">Phone Number</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-4 h-0.5 bg-blue-500"></div>
                    <span className="text-muted-foreground">Chat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-purple-500"></div>
                    <span className="text-muted-foreground">Call</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-red-500"></div>
                    <span className="text-muted-foreground">Transaction</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 border-l border-border/50 bg-card/30 backdrop-blur-sm overflow-y-auto">
              {selectedNode ? (
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground/90 mb-4">Node Details</h3>
                  <div className="space-y-4">
                    <div className="glass elev rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground/90">Contact Info</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div><span className="text-muted-foreground">Name:</span> {selectedNode.name}</div>
                        <div><span className="text-muted-foreground">Phone:</span> {selectedNode.phone}</div>
                        {selectedNode.email && (
                          <div><span className="text-muted-foreground">Email:</span> {selectedNode.email}</div>
                        )}
                        <div><span className="text-muted-foreground">Connections:</span> {selectedNode.connections}</div>
                      </div>
                    </div>

                    {/* Related Activities */}
                    <div className="glass elev rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-foreground/90">Related Activities</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        {links
                          .filter(link => link.source === selectedNode.id || link.target === selectedNode.id)
                          .slice(0, 5)
                          .map((link, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                              <div className={`w-2 h-2 rounded-full ${
                                link.type === 'chat' ? 'bg-blue-500' :
                                link.type === 'call' ? 'bg-purple-500' : 'bg-red-500'
                              }`}></div>
                              <div className="flex-1">
                                <div className="text-xs text-muted-foreground">
                                  {link.type === 'chat' && 'Chat'}
                                  {link.type === 'call' && 'Call'}
                                  {link.type === 'transaction' && 'Transaction'}
                                </div>
                                <div className="text-xs">
                                  {link.type === 'call' && formatDuration(link.data.duration)}
                                  {link.type === 'transaction' && `${link.data.amount} ${link.data.currency}`}
                                  {link.type === 'chat' && link.data.message.slice(0, 30) + '...'}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : hoveredLink ? (
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground/90 mb-4">Link Details</h3>
                  <div className="glass elev rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {hoveredLink.type === 'chat' && <MessageSquare className="h-4 w-4 text-blue-500" />}
                      {hoveredLink.type === 'call' && <Phone className="h-4 w-4 text-purple-500" />}
                      {hoveredLink.type === 'transaction' && <CreditCard className="h-4 w-4 text-red-500" />}
                      <span className="font-medium text-foreground/90 capitalize">{hoveredLink.type}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div><span className="text-muted-foreground">From:</span> {hoveredLink.source}</div>
                      <div><span className="text-muted-foreground">To:</span> {hoveredLink.target}</div>
                      <div><span className="text-muted-foreground">Time:</span> {formatTimestamp(hoveredLink.data.timestamp)}</div>
                      {hoveredLink.type === 'call' && (
                        <div><span className="text-muted-foreground">Duration:</span> {formatDuration(hoveredLink.data.duration)}</div>
                      )}
                      {hoveredLink.type === 'transaction' && (
                        <div><span className="text-muted-foreground">Amount:</span> {hoveredLink.data.amount} {hoveredLink.data.currency}</div>
                      )}
                      {hoveredLink.type === 'chat' && (
                        <div><span className="text-muted-foreground">Message:</span> {hoveredLink.data.message}</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground/90 mb-4">Network Summary</h3>
                  <div className="space-y-4">
                    <div className="glass elev rounded-lg p-3">
                      <div className="text-2xl font-bold text-foreground/90">{nodes.length}</div>
                      <div className="text-sm text-muted-foreground">Total Nodes</div>
                    </div>
                    <div className="glass elev rounded-lg p-3">
                      <div className="text-2xl font-bold text-foreground/90">{links.length}</div>
                      <div className="text-sm text-muted-foreground">Total Connections</div>
                    </div>
                    <div className="glass elev rounded-lg p-3">
                      <div className="text-2xl font-bold text-foreground/90">
                        {nodes.filter(n => n.type === 'contact' && n.name !== 'Unknown').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Known Contacts</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
