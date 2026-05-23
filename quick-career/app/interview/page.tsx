"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mockQuestions, setMockQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState<any>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [allAnswers, setAllAnswers] = useState<any[]>([]);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const cvDataStr = searchParams.get("cvData");
  const targetRole = searchParams.get("targetRole");

  useEffect(() => {
    if (!cvDataStr || !targetRole) {
      router.push("/dashboard");
      return;
    }

    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    try {
      const cvData = JSON.parse(decodeURIComponent(cvDataStr!));

      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parsedData: cvData,
          targetRole: targetRole,
        }),
      });

      const data = await res.json();
      setMockQuestions(data.questions.slice(0, 3));
      setLoading(false);
    } catch (err) {
      console.error("Failed to generate questions:", err);
      router.push("/dashboard");
    }
  };

  const handleSubmitAnswer = async () => {
    const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;

    if (wordCount < 50) {
      alert("Answer must be at least 50 words");
      return;
    }

    setLoadingFeedback(true);

    const currentQuestion = mockQuestions[currentQuestionIndex];
    const cvData = JSON.parse(decodeURIComponent(cvDataStr!));

    const res = await fetch("/api/evaluate-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: currentQuestion.question,
        userAnswer: userAnswer,
        targetRole: targetRole,
        cvData: cvData,
      }),
    });

    const feedback = await res.json();
    setAnswerFeedback(feedback);

    const newAnswer = {
      question: currentQuestion.question,
      category: currentQuestion.category,
      userAnswer: userAnswer,
      feedback: feedback,
    };

    setAllAnswers((prev) => [...prev, newAnswer]);
    setLoadingFeedback(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setAnswerFeedback(null);
    } else {
      setInterviewComplete(true);
    }
  };

  const calculateOverallScore = () => {
    if (!allAnswers || allAnswers.length === 0) return 0;
    const totalScore = allAnswers.reduce(
      (sum, ans) => sum + (ans.feedback?.score || 0),
      0
    );
    const maxScore = allAnswers.length * 5;
    return Math.round((totalScore / maxScore) * 100);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔄</div>
          <p style={{ fontSize: 20, color: "#666" }}>
            Generating interview questions...
          </p>
        </div>
      </div>
    );
  }

  if (interviewComplete) {
    return (
      <div
        style={{
          background: "#f8f9fa",
          minHeight: "calc(100vh - 60px)",
          paddingBottom: 60,
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: 40,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 64, marginBottom: 15 }}>🎉</div>
              <h1 style={{ fontSize: 32, marginBottom: 10, color: "#333" }}>
                Interview Complete!
              </h1>
              <p style={{ fontSize: 16, color: "#666" }}>
                Great job! Here's how you performed
              </p>
            </div>

            <div
              style={{
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: 40,
                borderRadius: 12,
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              <h2 style={{ fontSize: 48, margin: 0, marginBottom: 10 }}>
                {calculateOverallScore()}%
              </h2>
              <p style={{ fontSize: 20, margin: 0, marginBottom: 15 }}>
                Overall Score
              </p>
              <p style={{ fontSize: 16, opacity: 0.9 }}>
                You earned{" "}
                {allAnswers.reduce(
                  (sum, ans) => sum + (ans.feedback?.score || 0),
                  0
                )}{" "}
                out of {allAnswers.length * 5} stars
              </p>
            </div>

            <h4 style={{ fontSize: 20, marginBottom: 20, color: "#333" }}>
              Performance Breakdown:
            </h4>
            {allAnswers.map((ans, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  border: "2px solid #e0e0e0",
                  padding: 20,
                  borderRadius: 10,
                  marginBottom: 15,
                  borderLeft: `6px solid ${
                    ans.feedback.score >= 4
                      ? "#4caf50"
                      : ans.feedback.score >= 3
                      ? "#ff9800"
                      : "#f44336"
                  }`,
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onClick={() =>
                  setExpandedQuestion(expandedQuestion === i ? null : i)
                }
                onMouseOver={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.boxShadow = "none")
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        background: "#e3f2fd",
                        color: "#1976d2",
                        padding: "4px 10px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {ans.category}
                    </span>
                    <h5
                      style={{
                        fontSize: 16,
                        marginTop: 12,
                        marginBottom: 8,
                        color: "#333",
                      }}
                    >
                      {ans.question}
                    </h5>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {"⭐".repeat(ans.feedback.score)} ({ans.feedback.score}/5)
                  </p>
                  <p
                    style={{ fontSize: 13, color: "#667eea", fontWeight: 600 }}
                  >
                    {expandedQuestion === i ? "▲ Hide Details" : "▼ Show Details"}
                  </p>
                </div>

                {expandedQuestion === i && (
                  <div
                    style={{
                      marginTop: 20,
                      paddingTop: 20,
                      borderTop: "2px solid #f5f5f5",
                    }}
                  >
                    <div
                      style={{
                        background: "#f1f8f4",
                        padding: 15,
                        borderRadius: 8,
                        marginBottom: 15,
                        border: "1px solid #c8e6c9",
                      }}
                    >
                      <h6
                        style={{
                          fontSize: 13,
                          marginBottom: 10,
                          color: "#2e7d32",
                          fontWeight: 700,
                        }}
                      >
                        Your Answer:
                      </h6>
                      <p
                        style={{
                          fontSize: 14,
                          fontStyle: "italic",
                          color: "#555",
                          lineHeight: 1.6,
                        }}
                      >
                        {ans.userAnswer}
                      </p>
                    </div>

                    <div
                      style={{
                        background: "#e3f2fd",
                        padding: 15,
                        borderRadius: 8,
                        marginBottom: 15,
                        border: "1px solid #90caf9",
                      }}
                    >
                      <h6
                        style={{
                          fontSize: 13,
                          marginBottom: 10,
                          color: "#1565c0",
                          fontWeight: 700,
                        }}
                      >
                        ✅ Strengths:
                      </h6>
                      <p style={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}>
                        {ans.feedback.strengths}
                      </p>
                    </div>

                    <div
                      style={{
                        background: "#ffebee",
                        padding: 15,
                        borderRadius: 8,
                        border: "1px solid #ffcdd2",
                      }}
                    >
                      <h6
                        style={{
                          fontSize: 13,
                          marginBottom: 10,
                          color: "#c62828",
                          fontWeight: 700,
                        }}
                      >
                        🔧 Areas to Improve:
                      </h6>
                      <p
                        style={{
                          fontSize: 14,
                          whiteSpace: "pre-line",
                          color: "#333",
                          lineHeight: 1.6,
                        }}
                      >
                        {ans.feedback.improvements}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button
                onClick={() => router.push("/dashboard")}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "16px 40px",
                  fontSize: 16,
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f8f9fa",
        minHeight: "calc(100vh - 60px)",
        paddingBottom: 60,
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: 30,
            borderRadius: 12,
            marginBottom: 30,
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 32, margin: 0, marginBottom: 10 }}>
            🎤 Mock Interview Session
          </h1>
          <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>
            Target Role: {targetRole}
          </p>
        </div>

        {/* Progress */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 25,
            marginBottom: 30,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ fontSize: 14, color: "#666", marginBottom: 15 }}>
            Question {currentQuestionIndex + 1} of {mockQuestions.length}
          </p>
          <div
            style={{
              width: "100%",
              height: 8,
              background: "#e0e0e0",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / mockQuestions.length) * 100
                }%`,
                height: "100%",
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                transition: "width 0.5s",
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 40,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <span
            style={{
              background: "#e3f2fd",
              color: "#1976d2",
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 20,
              display: "inline-block",
            }}
          >
            {mockQuestions[currentQuestionIndex].category}
          </span>

          <h2
            style={{
              color: "#333",
              fontSize: 24,
              marginBottom: 30,
              lineHeight: 1.5,
            }}
          >
            {mockQuestions[currentQuestionIndex].question}
          </h2>

          {!answerFeedback && (
            <>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here (minimum 50 words)..."
                style={{
                  width: "100%",
                  minHeight: 200,
                  padding: 20,
                  fontSize: 15,
                  border: "2px solid #e0e0e0",
                  borderRadius: 10,
                  marginBottom: 15,
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    color:
                      userAnswer.trim().split(/\s+/).filter(Boolean).length >=
                      50
                        ? "#4caf50"
                        : "#999",
                    fontWeight: 600,
                  }}
                >
                  Word count:{" "}
                  {userAnswer.trim().split(/\s+/).filter(Boolean).length} / 50
                </p>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={loadingFeedback}
                  style={{
                    background: loadingFeedback ? "#ccc" : "#4caf50",
                    color: "white",
                    padding: "16px 40px",
                    fontSize: 16,
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: 8,
                    cursor: loadingFeedback ? "not-allowed" : "pointer",
                    boxShadow: loadingFeedback
                      ? "none"
                      : "0 4px 12px rgba(76, 175, 80, 0.3)",
                  }}
                >
                  {loadingFeedback ? "Analyzing..." : "Submit Answer"}
                </button>
              </div>
            </>
          )}

          {answerFeedback && (
            <div>
              <div
                style={{
                  background: "#f1f8f4",
                  padding: 20,
                  borderRadius: 10,
                  marginBottom: 20,
                  border: "1px solid #c8e6c9",
                }}
              >
                <h5
                  style={{ marginBottom: 12, color: "#2e7d32", fontSize: 15 }}
                >
                  Your Answer:
                </h5>
                <p
                  style={{
                    fontStyle: "italic",
                    color: "#555",
                    lineHeight: 1.6,
                    fontSize: 14,
                  }}
                >
                  {userAnswer}
                </p>
              </div>

              <div
                style={{
                  background: "#fff3e0",
                  padding: 20,
                  borderRadius: 10,
                  marginBottom: 15,
                  border: "1px solid #ffe082",
                }}
              >
                <h5 style={{ fontSize: 18, color: "#f57c00" }}>
                  📊 Score: {"⭐".repeat(answerFeedback.score)} (
                  {answerFeedback.score}/5)
                </h5>
              </div>

              <div
                style={{
                  background: "#e3f2fd",
                  padding: 20,
                  borderRadius: 10,
                  marginBottom: 15,
                  border: "1px solid #90caf9",
                }}
              >
                <h5
                  style={{ marginBottom: 12, color: "#1565c0", fontSize: 15 }}
                >
                  ✅ Strengths:
                </h5>
                <p style={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}>
                  {answerFeedback.strengths}
                </p>
              </div>

              <div
                style={{
                  background: "#ffebee",
                  padding: 20,
                  borderRadius: 10,
                  marginBottom: 25,
                  border: "1px solid #ffcdd2",
                }}
              >
                <h5
                  style={{ marginBottom: 12, color: "#c62828", fontSize: 15 }}
                >
                  🔧 Areas to Improve:
                </h5>
                <p
                  style={{
                    whiteSpace: "pre-line",
                    fontSize: 14,
                    color: "#333",
                    lineHeight: 1.6,
                  }}
                >
                  {answerFeedback.improvements}
                </p>
              </div>

              <button
                onClick={handleNextQuestion}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "16px 40px",
                  fontSize: 16,
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                }}
              >
                {currentQuestionIndex < mockQuestions.length - 1
                  ? "Next Question →"
                  : "View Final Summary"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "calc(100vh - 60px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8f9fa",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🔄</div>
            <p style={{ fontSize: 20, color: "#666" }}>Loading...</p>
          </div>
        </div>
      }
    >
      <InterviewContent />
    </Suspense>
  );
}
