import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function StudentDetail() {
  const { usn } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await studentService.getStudentByUSN(usn);
        setStudent(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student:', error);
        setLoading(false);
      }
    };

    fetchStudent();
  }, [usn]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!student) {
    return <div className="flex justify-center items-center h-screen">Student not found</div>;
  }

  // Prepare data for academic performance chart
  const academicData = {
    labels: ['10th', 'PUC', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
    datasets: [
      {
        label: 'Percentage',
        data: [
          student.tenth,
          student.puc,
          student.sem1,
          student.sem2,
          student.sem3,
          student.sem4,
          student.sem5,
          student.sem6
        ],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  // Prepare data for subject-wise performance
  const subjectData = {
    labels: ['Math', 'Science', 'English', 'CS Core', 'Lab', 'Other'],
    datasets: [
      {
        data: [85, 78, 82, 88, 90, 80], // Mock data - replace with actual if available
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Details</h1>
        <Button onClick={() => navigate(-1)}>Back to Dashboard</Button>
      </div>

      {/* Student Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{student.name}</CardTitle>
          <p className="text-gray-600">USN: {student.usn}</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold">Academic Information</h3>
            <p>10th: {student.tenth}%</p>
            <p>PUC: {student.puc}%</p>
            <p>CGPA: {(student.aggregate / 10).toFixed(2)}</p>
          </div>
          <div>
            <h3 className="font-semibold">Current Status</h3>
            <p>Backlogs: {student.backlogs}</p>
            <p>Placement: 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                student.placement_status === 'Placed' 
                  ? 'bg-green-100 text-green-800' 
                  : student.placement_eligible 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {student.placement_status || (student.placement_eligible ? 'Eligible' : 'Not Eligible')}
              </span>
            </p>
            {student.company_placed && (
              <p>Company: {student.company_placed}</p>
            )}
            {student.package && (
              <p>Package: {student.package} LPA</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold">Contact</h3>
            <p>Email: {student.email || 'N/A'}</p>
            <p>Phone: {student.phone || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Academic Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <Line 
              data={academicData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Percentage (%)'
                    }
                  }
                }
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <Doughnut 
              data={subjectData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Marks */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Marks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">10th Standard</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.tenth}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">-</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">PUC/12th</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.puc}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">-</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Semester 1</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.sem1}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">Year 1</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Semester 2</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.sem2}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">Year 1</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Semester 3</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.sem3}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">Year 2</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Semester 4</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.sem4}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">Year 2</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Semester 5</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.sem5}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">Year 3</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Semester 6</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.sem6}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">Year 3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
