// ExportModal.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Spinner from '../common/Spinner';
import { generatePDF, generateCSV } from '../../utils/exportHelpers';
import { saveExportData } from '../../services/firestore';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../services/firebase';

const INITIAL_USER_DATA = { fullName: '', studentId: '', university: '', semester: '', email: '', notes: '' };

export default function ExportModal({ isOpen, onClose, calculatorType, resultData }) {
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!userData.fullName.trim()) errors.fullName = 'Full name is required';
    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) errors.email = 'Invalid email';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    if (status.message) setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const payload = {
        userData,
        calculatorType,
        resultData:
          calculatorType === 'GPA'
            ? { courses: resultData.courses, gpa: resultData.gpa }
            : { semesters: resultData.semesters, cgpa: resultData.cgpa },
        exportType: 'PDF & CSV',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      };
      await saveExportData(payload);

      // Generate and download PDF
      const doc = generatePDF({ userData, resultData, calculatorType });
      doc.save(`${calculatorType}_Report_${userData.fullName.replace(/\s+/g, '_')}.pdf`);

      // Generate and download CSV
      const csv = generateCSV(
        calculatorType === 'GPA'
          ? { courses: resultData.courses, gpa: resultData.gpa }
          : { semesters: resultData.semesters, cgpa: resultData.cgpa },
        calculatorType
      );
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${calculatorType}_Report_${userData.fullName.replace(/\s+/g, '_')}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      if (analytics) logEvent(analytics, 'export_action', { calculatorType, status: 'success' });
      setStatus({ type: 'success', message: 'Report exported!' });
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Export failed:', error);
      setStatus({ type: 'error', message: 'Export failed. Try again.' });
      if (analytics) logEvent(analytics, 'export_action', { calculatorType, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !loading && onClose()}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <div>
          <h3 className="text-2xl font-bold text-gradient">
            Export {calculatorType} Report
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill details to generate PDF & CSV.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="fullName"
            label="Full Name *"
            required
            value={userData.fullName}
            onChange={handleChange}
            error={fieldErrors.fullName}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              name="studentId"
              label="Student ID"
              value={userData.studentId}
              onChange={handleChange}
            />
            <Input
              name="semester"
              label="Semester"
              value={userData.semester}
              onChange={handleChange}
            />
          </div>
          <Input
            name="university"
            label="University"
            value={userData.university}
            onChange={handleChange}
          />
          <Input
            name="email"
            label="Email (optional)"
            type="email"
            value={userData.email}
            onChange={handleChange}
            error={fieldErrors.email}
          />
          <Input
            name="notes"
            label="Notes"
            value={userData.notes}
            onChange={handleChange}
          />
          {status.message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3 rounded-lg text-sm font-medium ${
                status.type === 'success'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}
              role="alert"
            >
              {status.message}
            </motion.div>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !userData.fullName}
          >
            {loading ? <Spinner /> : 'Generate PDF & CSV'}
          </Button>
        </form>
      </motion.div>
    </Modal>
  );
}