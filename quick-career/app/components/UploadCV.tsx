"use client";

import { useState } from "react";

export default function UploadCV() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Pilih file dulu");
      return;
    }

    if (!targetRole.trim()) {
      alert("Masukkan target role");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("cv", file);
    formData.append("targetRole", targetRole);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      alert("Please upload a PDF file");
    }
  };

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", paddingBottom: 60 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        
        {/* Upload Section */}
        {!result && (
          <div style={{ 
            background: "white",
            borderRadius: 16,
            padding: 60,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            textAlign: "center"
          }}>
            <h1 style={{ 
              fontSize: 42, 
              marginBottom: 15,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Analyze Your CV with AI
            </h1>
            <p style={{ fontSize: 18, color: "#666", marginBottom: 50 }}>
              Get instant feedback and personalized recommendations to land your dream job
            </p>

            {/* Drag & Drop Area */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: file ? "3px solid #4caf50" : "3px dashed #ccc",
                borderRadius: 16,
                padding: 60,
                marginBottom: 30,
                background: file ? "#f1f8f4" : "#fafafa",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <div style={{ fontSize: 64, marginBottom: 20 }}>
                {file ? "✅" : "📄"}
              </div>
              {file ? (
                <div>
                  <p style={{ fontSize: 18, fontWeight: "bold", color: "#4caf50", marginBottom: 5 }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: 14, color: "#666" }}>
                    Click to change file
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                    Drag & Drop your CV here
                  </p>
                  <p style={{ fontSize: 14, color: "#666", marginBottom: 15 }}>
                    or click to browse
                  </p>
                  <p style={{ fontSize: 12, color: "#999" }}>
                    PDF files only
                  </p>
                </div>
              )}
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ display: "none" }}
              />
            </div>

            {/* Target Role Input */}
            <div style={{ marginBottom: 30, textAlign: "left", maxWidth: 500, margin: "0 auto 30px" }}>
              <label style={{ 
                display: "block", 
                fontSize: 16, 
                fontWeight: 600,
                marginBottom: 10,
                color: "#333"
              }}>
                Target Role
              </label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer, Product Manager, Data Analyst"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                style={{ 
                  width: "100%",
                  padding: "15px 20px",
                  fontSize: 16,
                  border: "2px solid #e0e0e0",
                  borderRadius: 8,
                  outline: "none",
                  transition: "border 0.3s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>

            {/* Analyze Button */}
            <button 
              onClick={handleUpload} 
              disabled={loading || !file || !targetRole}
              style={{
                background: loading ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "18px 50px",
                fontSize: 18,
                fontWeight: "bold",
                border: "none",
                borderRadius: 8,
                cursor: loading || !file || !targetRole ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
                transition: "all 0.3s",
                opacity: loading || !file || !targetRole ? 0.6 : 1
              }}
            >
              {loading ? "🔄 Analyzing..." : "🚀 Analyze My CV"}
            </button>
          </div>
        )}

        {/* Results Section */}
        {result?.parsedData && (
          <div>
            {/* Back Button */}
            <button
              onClick={() => {
                setResult(null);
                setFile(null);
                setTargetRole("");
              }}
              style={{
                background: "white",
                border: "2px solid #667eea",
                color: "#667eea",
                padding: "10px 20px",
                borderRadius: 8,
                cursor: "pointer",
                marginBottom: 20,
                fontSize: 14,
                fontWeight: 600
              }}
            >
              ← Upload Another CV
            </button>

            {/* Target Role Banner */}
            <div style={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: 25,
              borderRadius: 12,
              marginBottom: 30,
              textAlign: "center"
            }}>
              <h2 style={{ margin: 0, fontSize: 28 }}>🎯 Target Role: {result.targetRole}</h2>
            </div>

            {/* Parsed CV Data Card */}
            <div style={{ 
              background: "white",
              borderRadius: 12,
              padding: 30,
              marginBottom: 30,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
            }}>
              <h3 style={{ fontSize: 22, marginBottom: 20, color: "#333" }}>📄 Your CV Information</h3>
              <div style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 15
              }}>
                <div>
                  <p style={{ fontSize: 12, color: "#999", marginBottom: 5 }}>NAME</p>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{result.parsedData.name}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#999", marginBottom: 5 }}>EMAIL</p>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{result.parsedData.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#999", marginBottom: 5 }}>PHONE</p>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{result.parsedData.phone}</p>
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>SKILLS</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {result.parsedData.skills?.map((skill: string, i: number) => (
                    <span key={i} style={{
                      background: "#e3f2fd",
                      color: "#1976d2",
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 14,
                      fontWeight: 500
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CV Analysis Section */}
            {result?.feedback && (
              <div style={{ 
                background: "white",
                borderRadius: 12,
                padding: 30,
                marginBottom: 30,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
              }}>
                <h3 style={{ fontSize: 26, marginBottom: 30, color: "#333" }}>🎯 CV Analysis & Feedback</h3>

                {/* Score Card */}
                <div style={{ 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: 40,
                  borderRadius: 16,
                  marginBottom: 30,
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)"
                }}>
                  <p style={{ fontSize: 18, margin: 0, marginBottom: 10, opacity: 0.9 }}>Your CV Score</p>
                  <h1 style={{ fontSize: 72, margin: 0, marginBottom: 15, fontWeight: "bold" }}>
                    {Math.round(result.feedback.atsScore / 10)}/10
                  </h1>
                  <div style={{ 
                    width: "100%",
                    maxWidth: 400,
                    margin: "0 auto",
                    background: "rgba(255,255,255,0.2)", 
                    borderRadius: 20, 
                    height: 12,
                    overflow: "hidden"
                  }}>
                    <div style={{ 
                      width: `${result.feedback.atsScore}%`, 
                      background: "white",
                      height: "100%",
                      borderRadius: 20,
                      transition: "width 1s ease-out"
                    }}></div>
                  </div>
                  <p style={{ fontSize: 14, marginTop: 15, opacity: 0.8 }}>
                    {result.feedback.atsScore >= 80 ? "Excellent! Your CV is ATS-ready" :
                     result.feedback.atsScore >= 60 ? "Good! A few improvements needed" :
                     "Needs improvement to pass ATS systems"}
                  </p>
                </div>

                {/* Top 3 Priority Improvements */}
                <div style={{ marginBottom: 30 }}>
                  <h4 style={{ fontSize: 20, marginBottom: 20, color: "#333" }}>🔥 Top 3 Priority Improvements</h4>
                  
                  {result.feedback.improvements?.slice(0, 3).map((item: any, i: number) => (
                    <div key={i} style={{ 
                      background: "#fff8e1",
                      border: "1px solid #ffe082",
                      borderLeft: "5px solid #ffc107",
                      padding: 20,
                      borderRadius: 10,
                      marginBottom: 15
                    }}>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                        <span style={{
                          background: "#ffc107",
                          color: "white",
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          marginRight: 12,
                          fontSize: 14
                        }}>
                          {i + 1}
                        </span>
                        <h5 style={{ margin: 0, fontSize: 16, color: "#333" }}>{item.category}</h5>
                      </div>
                      <p style={{ fontSize: 14, color: "#666", marginBottom: 10, marginLeft: 40 }}>
                        ⚠️ {item.issue}
                      </p>
                      <p style={{ fontSize: 14, color: "#1976d2", marginLeft: 40, fontWeight: 500 }}>
                        💡 {item.suggestion}
                      </p>
                    </div>
                  ))}

                  {result.feedback.improvements?.length > 3 && (
                    <button
                      onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                      style={{
                        background: "white",
                        border: "2px solid #667eea",
                        color: "#667eea",
                        padding: "12px 24px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 600,
                        marginTop: 10,
                        transition: "all 0.3s"
                      }}
                    >
                      {showAllSuggestions 
                        ? "▲ Show Less" 
                        : `▼ View All ${result.feedback.improvements.length} Suggestions`}
                    </button>
                  )}
                </div>

                {/* All Suggestions (Collapsible) */}
                {showAllSuggestions && (
                  <div style={{ marginBottom: 30 }}>
                    <h4 style={{ fontSize: 18, marginBottom: 20, color: "#666" }}>📋 Additional Suggestions</h4>
                    
                    {result.feedback.improvements?.slice(3).map((item: any, i: number) => (
                      <div key={i} style={{ 
                        background: "#f5f5f5",
                        border: "1px solid #e0e0e0",
                        borderLeft: "4px solid #bdbdbd",
                        padding: 18,
                        borderRadius: 8,
                        marginBottom: 12
                      }}>
                        <h5 style={{ fontSize: 15, marginBottom: 8, color: "#333" }}>
                          {i + 4}. {item.category}
                        </h5>
                        <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
                          ⚠️ {item.issue}
                        </p>
                        <p style={{ fontSize: 13, color: "#1976d2" }}>
                          💡 {item.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Strengths */}
                {result.feedback.strengths?.length > 0 && (
                  <div style={{ 
                    background: "#e8f5e9",
                    border: "1px solid #c8e6c9",
                    padding: 20,
                    borderRadius: 10,
                    marginBottom: 20
                  }}>
                    <h4 style={{ fontSize: 18, marginBottom: 15, color: "#2e7d32" }}>✅ Your Strengths</h4>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {result.feedback.strengths.map((item: string, i: number) => (
                        <li key={i} style={{ marginBottom: 8, color: "#333", fontSize: 14 }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing Skills */}
                {result.feedback.missingSkills?.length > 0 && (
                  <div style={{ marginBottom: 30 }}>
                    <h4 style={{ fontSize: 18, marginBottom: 15, color: "#333" }}>⚠️ Missing Skills for {result.targetRole}</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {result.feedback.missingSkills.map((skill: string, i: number) => (
                        <span key={i} style={{
                          background: "#ffebee",
                          color: "#d32f2f",
                          padding: "8px 16px",
                          borderRadius: 20,
                          fontSize: 14,
                          fontWeight: 600,
                          border: "1px solid #ffcdd2"
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Path */}
                {result.feedback.learningPath?.length > 0 && (
                  <div style={{ marginBottom: 30 }}>
                    <h4 style={{ fontSize: 20, marginBottom: 10, color: "#333" }}>📚 Personalized Learning Roadmap</h4>
                    <p style={{ color: "#666", marginBottom: 20, fontSize: 14 }}>
                      Close your skill gaps and become job-ready for {result.targetRole}
                    </p>
                    
                    {result.feedback.learningPath.map((item: any, i: number) => (
                      <div key={i} style={{ 
                        background: "white",
                        border: `2px solid ${
                          item.priority === "High" ? "#ffcdd2" : 
                          item.priority === "Medium" ? "#ffe0b2" : "#c8e6c9"
                        }`,
                        padding: 25,
                        borderRadius: 12,
                        marginBottom: 20,
                        borderLeft: `6px solid ${
                          item.priority === "High" ? "#d32f2f" : 
                          item.priority === "Medium" ? "#f57c00" : "#388e3c"
                        }`
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 15, flexWrap: "wrap", gap: 10 }}>
                          <div>
                            <h5 style={{ fontSize: 20, margin: 0, marginBottom: 8, color: "#333" }}>{item.skill}</h5>
                            <span style={{
                              background: item.priority === "High" ? "#ffebee" : 
                                         item.priority === "Medium" ? "#fff3e0" : "#e8f5e9",
                              color: item.priority === "High" ? "#d32f2f" : 
                                     item.priority === "Medium" ? "#f57c00" : "#388e3c",
                              padding: "5px 12px",
                              borderRadius: 16,
                              fontSize: 12,
                              fontWeight: 700,
                              textTransform: "uppercase"
                            }}>
                              {item.priority} Priority
                            </span>
                          </div>
                          <span style={{ 
                            background: "#f5f5f5",
                            padding: "8px 14px",
                            borderRadius: 20,
                            fontSize: 13,
                            color: "#666",
                            fontWeight: 600
                          }}>
                            ⏱️ {item.timeEstimate}
                          </span>
                        </div>

                        <p style={{ color: "#555", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                          💡 {item.reason}
                        </p>

                        <div style={{ background: "#fafafa", padding: 20, borderRadius: 10 }}>
                          <h6 style={{ fontSize: 14, marginBottom: 15, color: "#666", fontWeight: 700 }}>📖 Recommended Resources:</h6>
                          
                          {item.resources?.map((resource: any, j: number) => (
                            <div key={j} style={{ 
                              background: "white",
                              padding: 15,
                              borderRadius: 8,
                              marginBottom: 12,
                              border: "1px solid #e0e0e0"
                            }}>
                              <div style={{ display: "flex", alignItems: "center", marginBottom: 8, gap: 10 }}>
                                <span style={{ 
                                  background: "#e3f2fd",
                                  color: "#1976d2",
                                  padding: "4px 10px",
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  textTransform: "uppercase"
                                }}>
                                  {resource.type}
                                </span>
                                <strong style={{ fontSize: 15, color: "#333" }}>{resource.title}</strong>
                              </div>
                              
                              {resource.provider && (
                                <p style={{ fontSize: 13, color: "#888", margin: "5px 0" }}>
                                  by {resource.provider}
                                </p>
                              )}
                              
                              {resource.description && (
                                <p style={{ fontSize: 13, color: "#666", margin: "8px 0", lineHeight: 1.5 }}>
                                  {resource.description}
                                </p>
                              )}
                              
                              {resource.link && (
                                <a 
                                  href={resource.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{ 
                                    color: "#1976d2",
                                    fontSize: 13,
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    marginTop: 8
                                  }}
                                  onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
                                  onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}
                                >
                                  Visit Resource →
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Wins */}
                {result.feedback.recommendations?.length > 0 && (
                  <div style={{ 
                    background: "#e3f2fd",
                    border: "1px solid #90caf9",
                    padding: 20,
                    borderRadius: 10
                  }}>
                    <h4 style={{ fontSize: 18, marginBottom: 15, color: "#1565c0" }}>💡 Quick Wins</h4>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {result.feedback.recommendations.map((rec: string, i: number) => (
                        <li key={i} style={{ marginBottom: 8, color: "#333", fontSize: 14 }}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* MOCK INTERVIEW BUTTON - REDIRECT */}
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button 
                onClick={() => {
                  const cvDataEncoded = encodeURIComponent(JSON.stringify(result.parsedData));
                  const targetRoleEncoded = encodeURIComponent(result.targetRole);
                  window.location.href = `/interview?cvData=${cvDataEncoded}&targetRole=${targetRoleEncoded};`
                }}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "18px 40px",
                  fontSize: 18,
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                  transition: "transform 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                🎤 Practice Mock Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}