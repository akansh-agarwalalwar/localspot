#!/bin/bash

echo "🧪 Testing StudentsHub Email Functionality"
echo "=========================================="

echo "📧 Testing Freelancer Registration Email..."
curl -s -X POST http://localhost:5004/api/email/send-freelancer-email \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Vansh Agarwal (Test)",
    "email": "vansh.test@gmail.com",
    "mobile": "+91 9876543210", 
    "year": "3rd Year",
    "branch": "Computer Science Engineering",
    "skills": ["coding", "assignments", "documents"],
    "experience": "intermediate",
    "hourlyRate": "₹500-800 per project"
  }' | python3 -m json.tool

echo ""
echo "================================================"
echo ""

echo "📧 Testing Client Project Request Email..."
curl -s -X POST http://localhost:5004/api/email/send-client-email \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Client",
    "email": "client.test@gmail.com",
    "mobile": "+91 9876543210",
    "projectTitle": "Data Analysis Assignment for Final Year", 
    "projectType": "assignment",
    "description": "Need help with statistical analysis using Python and creating visualizations for my final year project. The dataset contains student performance data and requires correlation analysis, regression modeling, and presentation-ready charts.",
    "deadline": "2025-08-30T23:59:59",
    "budget": "₹800-1200",
    "skillsNeeded": ["coding", "excel", "documents"],
    "urgency": "medium"
  }' | python3 -m json.tool

echo ""
echo "🎉 Email tests completed!"
echo "📧 Check helpstudentshub@gmail.com for both test emails."
