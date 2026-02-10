import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  techStack: string[];
  github?: string;
  demo?: string;
}

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("all");

  const projects: Project[] = [
    {
      id: "agrifutura-ai",
      title: "AgriFutura AI Diagnosis",
      description: "A deep learning-powered plant disease detection system. Using Convolutional Neural Networks (CNNs), it identifies crop diseases from leaf images to help farmers protect yields and reduce pesticide usage.",
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2070&auto=format&fit=crop",
      category: "ai",
      techStack: ["TensorFlow", "Python", "OpenCV", "Keras"],
      github: "https://github.com/Aditya7615/AgriFutura-AI-Diagnosis",
      demo: "https://agrifutura-ai-diagnosis-4fbtwdayberrn8hcywonlt.streamlit.app"
    },
    {
      id: "deepfake-detector",
      title: "AI Deepfake Detector",
      description: "TensorFlow-based image classifier that can identify manipulated images and deepfakes with high accuracy.",
      image: "https://images.unsplash.com/photo-1633265486501-0cf524a07213?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "ai",
      techStack: ["TensorFlow", "Keras", "Python", "Scikit-Learn"],
      github: "https://github.com/Aditya7615/ai-image-detector",
      demo: "https://ai-image-detector-jaitfqcdpsawap5bknvasv.streamlit.app"
    },
    {
      id: "text-condenser",
      title: "Automated Text Condenser",
      description: "An NLP-based summarization tool that uses extractive and abstractive techniques to condense long articles into concise summaries while preserving key information and context.",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop",
      category: "ai",
      techStack: ["Python", "NLTK", "Transformers", "NLP"],
      github: "https://github.com/Aditya7615/Automated-Text-Condenser",
      demo: "https://github.com/Aditya7615/Automated-Text-Condenser" // Points to GitHub since no live demo exists
    },
    {
      id: "ml-deconstructed",
      title: "ML Deconstructed",
      description: "A deep-dive into machine learning fundamentals by implementing core algorithms from scratch using only NumPy. Covers the mathematical foundations of Linear Regression, SVMs, and Neural Networks.",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop",
      category: "ai",
      techStack: ["Python", "NumPy", "Mathematics", "Algorithms"],
      github: "https://github.com/Aditya7615/ml-deconstructed",
      demo: "https://raw.githack.com/Aditya7615/ml-deconstructed/main/index.html"
    },
    {
      id: "credit-card-segmentation",
      title: "Credit Card Customer Segmentation",
      description: "Advanced customer profiling and segmentation using unsupervised machine learning. Analyzed usage patterns to group customers for targeted marketing strategies using K-Means and PCA.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop",
      category: "data",
      techStack: ["Python", "Scikit-Learn", "Pandas", "Matplotlib", "Clustering"],
      github: "https://github.com/Aditya7615/Credit-Card-Segmentation-Project",
      demo: "https://github.com/Aditya7615/Credit-Card-Segmentation-Project"
    }
  ];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter(project => project.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="projects" className="section-padding bg-black/50">
      <div className="section-container" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold font-poppins mb-6"
          >
            Featured <span className="gradient-text">Projects</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            A selection of my most significant work across different domains.
          </motion.p>
        </motion.div>

        <Tabs defaultValue="all" className="w-full">
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-12"
          >
            <TabsList className="bg-muted/50">
              <TabsTrigger
                value="all"
                onClick={() => setActiveCategory("all")}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All Projects
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                onClick={() => setActiveCategory("ai")}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                AI/ML
              </TabsTrigger>
              <TabsTrigger
                value="web"
                onClick={() => setActiveCategory("web")}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Web Dev
              </TabsTrigger>
              <TabsTrigger
                value="data"
                onClick={() => setActiveCategory("data")}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Data Analytics
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value={activeCategory} className="mt-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="relative aspect-video">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-poppins font-semibold text-xl mb-2">{project.title}</h3>
                    <p className="text-gray-300 mb-4 h-24 overflow-hidden">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-muted px-2 py-1 rounded-md text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      {project.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            <span>GitHub</span>
                          </a>
                        </Button>
                      )}

                      {project.demo && (
                        <Button variant="gradient" size="sm" asChild>
                          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            <span>Live Demo</span>
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>

        <motion.div
          variants={itemVariants}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com/Aditya7615" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              <span>View More on GitHub</span>
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
