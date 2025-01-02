import React, { useEffect, useRef } from 'react';

const AIAnimation = ({ className }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    let animationFrameId
    let angle = 0
    let pulseScale = 0

    const animate = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) * 0.35

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, width, height)

      pulseScale = Math.sin(angle * 2) * 0.1 + 0.9

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * pulseScale, 0, Math.PI * 2)
      ctx.lineWidth = radius * 0.15
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)'
      ctx.stroke()

      for (let i = 0; i < 36; i++) {
        const a = (i * Math.PI * 2) / 36 + angle
        const gradient = ctx.createLinearGradient(
          centerX + Math.cos(a) * radius * 0.5,
          centerY + Math.sin(a) * radius * 0.5,
          centerX + Math.cos(a) * radius * 1.5,
          centerY + Math.sin(a) * radius * 1.5
        )

        gradient.addColorStop(0, 'rgba(147, 51, 234, 0)')
        gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.3)')
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius * pulseScale, a, a + Math.PI / 18)
        ctx.lineWidth = radius * 0.15
        ctx.strokeStyle = gradient
        ctx.stroke()
      }

      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI * 2) / 12 + angle * 2
        const x = centerX + Math.cos(a) * radius * pulseScale
        const y = centerY + Math.sin(a) * radius * pulseScale
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.1)
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)')
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0)')
        
        ctx.beginPath()
        ctx.arc(x, y, radius * 0.05, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      angle += 0.01
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className={`w-full h-full ${className || ''}`} aria-hidden="true" />
}

export default AIAnimation;

