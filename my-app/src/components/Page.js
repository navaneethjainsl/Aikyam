'use client'

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let nodes: { x: number; y: number; connections: number[] }[] = []
    const numNodes = 50

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: []
      })

      for (let j = 0; j < 3; j++) {
        const connectionIndex = Math.floor(Math.random() * numNodes)
        if (connectionIndex !== i) {
          nodes[i].connections.push(connectionIndex)
        }
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      nodes.forEach((node, i) => {
        node.connections.forEach(connectionIndex => {
          const connectedNode = nodes[connectionIndex]
          const dx = connectedNode.x - node.x
          const dy = connectedNode.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 200) {
            const opacity = 1 - distance / 200
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(connectedNode.x, connectedNode.y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.5})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })

        ctx.beginPath()
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(99, 102, 241, 0.6)'
        ctx.fill()

        nodes[i].x += Math.sin(Date.now() * 0.001 + i) * 0.5
        nodes[i].y += Math.cos(Date.now() * 0.001 + i) * 0.5

        if (nodes[i].x < 0) nodes[i].x = canvas.width
        if (nodes[i].x > canvas.width) nodes[i].x = 0
        if (nodes[i].y < 0) nodes[i].y = canvas.height
        if (nodes[i].y > canvas.height) nodes[i].y = 0
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              AI-Powered Accessibility Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600 leading-relaxed">
              Leveraging machine learning to break down barriers and create an inclusive digital world. 
              Our AI models adapt to individual needs, providing personalized assistance for everyone.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a href="/signup" className="inline-block">
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                  SignUp
                </button>
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-12 left-0 right-0"
          >
            <div className="grid grid-cols-3 max-w-3xl mx-auto gap-8 px-4">
              <div className="text-center">
                <h3 className="font-bold text-lg text-indigo-600">Speech Recognition</h3>
                <p className="text-gray-600 text-sm">Advanced AI models for precise speech interpretation</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-indigo-600">Visual Assistance</h3>
                <p className="text-gray-600 text-sm">Real-time object detection and scene description</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-indigo-600">Adaptive Learning</h3>
                <p className="text-gray-600 text-sm">Personalized solutions that grow with you</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
