import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentService.getAllStudents();
        setStudents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Prepare data for charts
  const placementData = {
    labels: ['Placed', 'Not Placed', 'Not Eligible'],
    datasets: [
      {
        data: [
          students.filter(s => s.placement_status === 'Placed').length,
          students.filter(s => s.placement_status === 'Not Placed').length,
          students.filter(s => !s.placement_eligible).length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{students.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Placed Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {students.filter(s => s.placement_status === 'Placed').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Eligible Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {students.filter(s => s.placement_eligible).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Aggregate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(students.reduce((sum, s) => sum + parseFloat(s.aggregate || 0), 0) / students.length).toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Placement Status</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <Pie 
              data={placementData}
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <Bar 
              data={{
                labels: students.map(s => s.name.split(' ')[0]),
                datasets: [{
                  label: 'Aggregate %',
                  data: students.map(s => s.aggregate),
                  backgroundColor: 'rgba(54, 162, 235, 0.6)'
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Percentage (%)' }
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>USN</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Aggregate</TableHead>
                <TableHead>Backlogs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.usn}>
                  <TableCell>{student.usn}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.aggregate}%</TableCell>
                  <TableCell>{student.backlogs}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.placement_status === 'Placed' 
                        ? 'bg-green-100 text-green-800' 
                        : student.placement_eligible 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {student.placement_status || (student.placement_eligible ? 'Eligible' : 'Not Eligible')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/students/${student.usn}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
