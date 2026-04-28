import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "100px 20px",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: 56, margin: 0, marginBottom: 20 }}>
          Land Your Dream Job with AI
        </h1>
        <p style={{ fontSize: 20, marginBottom: 40, opacity: 0.9 }}>
          Get instant CV feedback, skill gap analysis, and practice with AI-powered mock interviews
        </p>
        <Link 
          href="/dashboard"
          style={{
            background: "white",
            color: "#667eea",
            padding: "15px 40px",
            fontSize: 18,
            fontWeight: "bold",
            borderRadius: 8,
            textDecoration: "none",
            display: "inline-block",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
        >
          Analyze Your CV Now →
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "80px 20px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 40, marginBottom: 60 }}>
          How It Works
        </h2>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 40
        }}>
          {/* Feature 1 */}
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ 
              fontSize: 48, 
              marginBottom: 20,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              📄
            </div>
            <h3 style={{ fontSize: 24, marginBottom: 15 }}>Upload Your CV</h3>
            <p style={{ color: "#666", lineHeight: 1.6 }}>
              Simply upload your CV in PDF format. Our AI instantly extracts and analyzes your information.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ 
              fontSize: 48, 
              marginBottom: 20,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              🎯
            </div>
            <h3 style={{ fontSize: 24, marginBottom: 15 }}>Get Detailed Feedback</h3>
            <p style={{ color: "#666", lineHeight: 1.6 }}>
              Receive personalized suggestions, skill gap analysis, and ATS score to improve your CV.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ 
              fontSize: 48, 
              marginBottom: 20,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              🎤
            </div>
            <h3 style={{ fontSize: 24, marginBottom: 15 }}>Practice Interviews</h3>
            <p style={{ color: "#666", lineHeight: 1.6 }}>
              Get AI-generated interview questions and instant feedback on your answers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: "#f5f5f5",
        padding: "60px 20px",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: 36, marginBottom: 20 }}>
          Ready to Level Up Your Career?
        </h2>
        <p style={{ fontSize: 18, color: "#666", marginBottom: 30 }}>
          Join thousands of job seekers who improved their CV with AI
        </p>
        <Link 
          href="/dashboard"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "15px 40px",
            fontSize: 18,
            fontWeight: "bold",
            borderRadius: 8,
            textDecoration: "none",
            display: "inline-block",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
        >
          Get Started Free
        </Link>
      </section>
    </div>
  );
}