"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  Camera,
  History,
  BookOpen,
  BarChart3,
  Brain,
  HandMetal,
  Heart,
  Stethoscope,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { Marquee } from "@/components/ui/marquee"
import TextPressure from "@/components/text-pressure"
import { AnimatedBeam } from "@/components/animated-beam"
import { FloatingIcons } from "@/components/floating-icons"
import { AnimatedCards } from "@/components/animated-cards"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// Lista de frases médicas en lenguaje de señas
const medicalPhrases = [
  { text: "Tengo fiebre", category: "Síntomas" },
  { text: "Me duele la cabeza", category: "Síntomas" },
  { text: "Necesito medicamentos", category: "Solicitudes" },
  { text: "Tengo alergia", category: "Condiciones" },
  { text: "Me siento mareado", category: "Síntomas" },
  { text: "Necesito un intérprete", category: "Solicitudes" },
  { text: "Tengo diabetes", category: "Condiciones" },
  { text: "Estoy embarazada", category: "Condiciones" },
  { text: "Tengo dolor de estómago", category: "Síntomas" },
  { text: "Necesito ayuda", category: "Solicitudes" },
]

// Características para el BentoGrid
const features = [
  {
    Icon: Brain,
    name: "Inteligencia Artificial",
    description: "Evaluación en tiempo real con modelos de IA avanzados para reconocimiento de señas.",
    href: "/practice",
    cta: "Probar ahora",
    className: "col-span-3 md:col-span-1",
    background: (
      <AnimatedBeam className="absolute inset-0" numBeams={8} beamColor="hsl(var(--primary))" beamOpacity={0.15} />
    ),
  },
  {
    Icon: HandMetal,
    name: "Señas Médicas",
    description: "Aprende más de 100 señas específicas para contextos médicos y de salud.",
    href: "/labels",
    cta: "Ver catálogo",
    className: "col-span-3 md:col-span-2",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
      >
        {medicalPhrases.map((phrase, idx) => (
          <figure
            key={idx}
            className="relative w-48 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2
                      border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]
                      dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]
                      transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
          >
            <div className="flex flex-col">
              <figcaption className="text-sm font-medium">{phrase.text}</figcaption>
              <span className="text-xs text-muted-foreground">{phrase.category}</span>
            </div>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: Heart,
    name: "Accesibilidad",
    description: "Diseñado para ser accesible para todos, incluyendo personas con discapacidad auditiva.",
    href: "#",
    cta: "Saber más",
    className: "col-span-3 md:col-span-2",
    background: (
      <FloatingIcons
        className="absolute inset-0"
        icons={[
          <Heart key="heart" className="text-red-400" />,
          <HandMetal key="hand" className="text-blue-400" />,
          <MessageSquare key="message" className="text-green-400" />,
        ]}
        count={15}
      />
    ),
  },
  {
    Icon: Stethoscope,
    name: "Profesionales de la Salud",
    description: "Herramienta esencial para médicos y enfermeras que atienden a pacientes con discapacidad auditiva.",
    href: "#",
    cta: "Descubrir",
    className: "col-span-3 md:col-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <Stethoscope className="w-32 h-32" />
      </div>
    ),
  },
]

// Testimonios
const testimonials = [
  {
    quote:
      "Esta plataforma ha transformado la forma en que me comunico con mis pacientes. Ahora puedo ofrecer una atención mucho más inclusiva.",
    author: "Dra. María Rodríguez",
    role: "Médico de Familia",
  },
  {
    quote:
      "Como persona sorda, esta herramienta me ha dado independencia en mis visitas médicas. Ya no necesito siempre un intérprete.",
    author: "Carlos Méndez",
    role: "Usuario",
  },
  {
    quote:
      "La precisión del reconocimiento de señas es impresionante. Las estadísticas de progreso me ayudan a mejorar constantemente.",
    author: "Laura Sánchez",
    role: "Estudiante de Enfermería",
  },
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Con TextPressure pero fondo limpio */}
      <section className="relative py-20 md:py-32 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 overflow-hidden">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 bg-grid opacity-30"></div>

        {/* Círculos decorativos */}
        <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-blue-200/20 dark:bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-20 left-[10%] w-72 h-72 rounded-full bg-indigo-200/20 dark:bg-indigo-500/10 blur-3xl"></div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 h-24"
            >
              <TextPressure
                text="SIGNMED"
                fontFamily="Inter, sans-serif"
                fontUrl=""
                textColor="hsl(var(--foreground))"
                strokeColor="hsl(var(--primary))"
                stroke={true}
                minFontSize={48}
                className="font-bold"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 inline-block"
            >
              <div className="bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg">
                <h2 className="text-2xl md:text-3xl font-bold">Aprende Lenguaje de Señas Médicas con IA</h2>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mb-8"
            >
              Plataforma educativa con inteligencia artificial para aprender y practicar lenguaje de señas en contextos
              médicos, diseñada para personas con discapacidad comunicativa y profesionales de la salud.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" asChild className="hover-lift">
                <Link href="/practice">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Comenzar a practicar
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="hover-lift">
                <Link href="/labels">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explorar señas
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-grid">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Características Principales</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre todas las herramientas que SignMed ofrece para mejorar la comunicación en entornos médicos.
            </p>
          </div>

          <BentoGrid>
            {features.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cómo Funciona</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un proceso simple y efectivo para aprender lenguaje de señas médicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover-effect">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-xl">1</span>
                </div>
                <CardTitle>Selecciona una Seña</CardTitle>
                <CardDescription>
                  Elige entre nuestro amplio catálogo de señas médicas organizadas por categorías.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover-effect">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-xl">2</span>
                </div>
                <CardTitle>Practica con la Cámara</CardTitle>
                <CardDescription>
                  Utiliza tu cámara para practicar la seña y recibir retroalimentación en tiempo real.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                  <Camera className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover-effect">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-xl">3</span>
                </div>
                <CardTitle>Analiza tu Progreso</CardTitle>
                <CardDescription>
                  Revisa tu historial y estadísticas para ver tu evolución y áreas de mejora.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lo que Dicen Nuestros Usuarios</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experiencias reales de personas que utilizan SignMed en su día a día.
            </p>
          </div>

          <div className="max-w-3xl mx-auto h-64">
            <AnimatedCards>
              {testimonials.map((testimonial, idx) => (
                <Card key={idx} className="h-full">
                  <CardContent className="pt-6 flex flex-col h-full justify-between">
                    <div>
                      <div className="mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Sparkles key={i} className="inline-block h-5 w-5 text-yellow-400 mr-1" />
                        ))}
                      </div>
                      <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </AnimatedCards>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Comienza tu Aprendizaje Hoy</h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a nuestra comunidad y mejora la comunicación en entornos médicos con lenguaje de señas.
            </p>
            <Button size="lg" variant="secondary" asChild className="hover-lift">
              <Link href="/practice">
                <Zap className="mr-2 h-4 w-4" />
                Comenzar Ahora
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Original Cards Section - Mantenido para compatibilidad */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Practicar Señas
                </CardTitle>
                <CardDescription>Practica señas médicas con evaluación en tiempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Aprende frases como "tengo fiebre y tos", "me duele la cabeza" y recibe retroalimentación inmediata.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/practice">Comenzar a practicar</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explorar Señas
                </CardTitle>
                <CardDescription>Descubre todas las señas médicas disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Explora el catálogo completo de señas médicas con ejemplos visuales e instrucciones detalladas.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/labels">Ver catálogo</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Historial
                </CardTitle>
                <CardDescription>Revisa tu historial de práctica</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Consulta tus intentos anteriores, evaluaciones y observaciones para mejorar tu aprendizaje.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/history">Ver historial</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Progreso
                </CardTitle>
                <CardDescription>Visualiza tu avance y estadísticas</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Analiza tu progreso con estadísticas detalladas, porcentajes de acierto y áreas de mejora.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/progress">Ver progreso</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
