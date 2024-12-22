'use client'

import React, { useEffect, useRef } from 'react'

const AiMotionAnimation: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    let angle = 0
    const animate = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.3

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < 12; i++) {
        const rotationAngle = (angle + (i * Math.PI * 2) / 12)
        
        ctx.beginPath()
        for (let j = 0; j < 50; j++) {
          const scale = 1 - j / 50
          const x = centerX + Math.cos(rotationAngle + j * 0.1) * radius * scale
          const y = centerY + Math.sin(rotationAngle + j * 0.1) * radius * scale
          
          if (j === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        
        const gradient = ctx.createLinearGradient(
          centerX - radius,
          centerY - radius,
          centerX + radius,
          centerY + radius
        )
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.5)') // Purple
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.5)') // Blue
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()
      }

      angle += 0.02
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}

export default AiMotionAnimation

