// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import './SalaryApp.css';

// const SalaryApp = () => {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const data = new Uint8Array(evt.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const json = XLSX.utils.sheet_to_json(worksheet);
//       setEmployees(json);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const calculateIncomeTax = (annualIncome) => {
//     const taxableIncome = annualIncome - 50000; // standard deduction
//     let tax = 0;

//     const slabs = [
//       { limit: 300000, rate: 0 },
//       { limit: 600000, rate: 0.05 },
//       { limit: 900000, rate: 0.10 },
//       { limit: 1200000, rate: 0.15 },
//       { limit: 1500000, rate: 0.20 },
//       { limit: Infinity, rate: 0.30 },
//     ];

//     let remaining = taxableIncome;
//     let prevLimit = 0;

//     for (const slab of slabs) {
//       if (remaining <= 0) break;
//       const taxableAtThisRate = Math.min(remaining, slab.limit - prevLimit);
//       tax += taxableAtThisRate * slab.rate;
//       remaining -= taxableAtThisRate;
//       prevLimit = slab.limit;
//     }

//     return Math.round(tax / 12); // monthly tax
//   };

//   const calculateSalaryDetails = (baseSalary) => {
//     const salary = Number(baseSalary);
//     const da = Math.round(salary * 0.425);
//     const hra = Math.round(salary * 0.16);
//     const cca = 450;
//     const others = 1800;
//     const ndcps14 = Math.round((salary + da) * 0.14);
//     const ndcps10 = Math.round((salary + da) * 0.10);
//     const subGross1 = salary + da + hra + cca + ndcps14 + others;

//     const daArrears = Math.round(da * 0.2); // adjustable %
//     const subGross2 = daArrears;
//     const grossIncome = subGross1 + subGross2;

//     const lic = Math.round(grossIncome * 0.05);
//     const profTax = 200;
//     const fbf = 200;
//     const annualIncome = grossIncome * 12;
//     const incomeTax = calculateIncomeTax(annualIncome);

//     const totalDeductions = lic + incomeTax + profTax + ndcps14 + ndcps10 + fbf;
//     const netSalary = grossIncome - totalDeductions;

//     const standardDeduction = 50000;
//     const totalIncome = annualIncome - standardDeduction;
//     const totalChaVIA = Math.min(150000 + 50000 + lic * 12, 200000);
//     const totalTaxableIncome = Math.max(totalIncome - totalChaVIA, 0);

//     return {
//       salary,
//       da,
//       hra,
//       cca,
//       ndcps: ndcps14,
//       others,
//       subGross1,
//       daArrears,
//       subGross2,
//       totalDeductions,
//       netSalary,
//       salary17: annualIncome,
//       totalIncome,
//       hraExempt: 0,
//       taxEmployment: 2400,
//       deductionsVia: lic * 12,
//       aggrDeductable: 200000,
//       chaVIAOther: 50000,
//       totalChaVIA,
//       totalTaxableIncome,
//     };
//   };

//   const handleGenerate = (employee) => {
//     const details = calculateSalaryDetails(employee.BaseSalary);
//     setSelectedEmployee({ ...employee, ...details });
//   };

//   const handleDownload = () => {
//     if (!selectedEmployee) return;

//     const emp = selectedEmployee;
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text(`Salary Slip - ${emp.Name}`, 14, 15);

//     autoTable(doc, {
//       startY: 25,
//       head: [['Component', 'apr-2024','mar-2024']],
//       body: [
//         ['BASIC SALARY', emp.salary],
//         ['DEARNESS ALLOWANCE', emp.da],
//         ['HOUSE RENT ALLOWANCE', emp.hra],
//         ['CITY COMPENSATE ALLOWANCE', emp.cca],
//         ['NDCPS', emp.ndcps],
//         ['OTHERS', emp.others],
//         ['SUB GROSS SALARY-I', emp.subGross1],
//         ['DA ARREARS', emp.daArrears],
//         ['SUB GROSS SALARY-II', emp.subGross2],
//         ['TOTAL DEDUCTIONS', emp.totalDeductions],
//         ['NET SALARY', emp.netSalary],
//         ['TOTAL SALARY INCOME', emp.salary17],
//         ['STANDARD DEDUCTION', 50000],
//         ['TOTAL INCOME', emp.totalIncome],
//         ['TOTAL CHA-VIA DEDUCTION', emp.totalChaVIA],
//         ['TOTAL TAXABLE INCOME', emp.totalTaxableIncome],
//       ],
//       styles: { fontSize: 10 },
//     });

//     doc.save(`${emp.Name}_SalarySlip.pdf`);
//   };

//   return (
//     <div className="container">
//       <div className="sidebar">
//         <h2>Upload Employee Excel</h2>
//         <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
//         {employees.length > 0 && (
//           <table className="employee-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Base Salary</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.map((emp, idx) => (
//                 <tr key={idx}>
//                   <td>{emp.Name}</td>
//                   <td>{emp.BaseSalary}</td>
//                   <td>
//                     <button onClick={() => handleGenerate(emp)}>Generate</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       <div className="content">
//         {selectedEmployee && (
//           <div className="employee-details">
//             <h2>Salary Details for {selectedEmployee.Name}</h2>
//             <table className="salary-table">
//               <thead>
//                 <tr>
//                   <th>Component</th>
//                   <th>Amount (₹)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr><td>Basic Salary</td><td>{selectedEmployee.salary}</td></tr>
//                 <tr><td>Dearness Allowance</td><td>{selectedEmployee.da}</td></tr>
//                 <tr><td>House Rent Allowance</td><td>{selectedEmployee.hra}</td></tr>
//                 <tr><td>City Compensate Allowance</td><td>{selectedEmployee.cca}</td></tr>
//                 <tr><td>NDCPS</td><td>{selectedEmployee.ndcps}</td></tr>
//                 <tr><td>Other Allowances</td><td>{selectedEmployee.others}</td></tr>
//                 <tr><td>Sub Gross Salary-I</td><td>{selectedEmployee.subGross1}</td></tr>
//                 <tr><td>DA Arrears</td><td>{selectedEmployee.daArrears}</td></tr>
//                 <tr><td>Sub Gross Salary-II</td><td>{selectedEmployee.subGross2}</td></tr>
//                 <tr><td>Total Deductions</td><td>{selectedEmployee.totalDeductions}</td></tr>
//                 <tr><td><strong>Net Salary</strong></td><td><strong>{selectedEmployee.netSalary}</strong></td></tr>
//                 <tr><td>Total Salary Income</td><td>{selectedEmployee.salary17}</td></tr>
//                 <tr><td>Total Income</td><td>{selectedEmployee.totalIncome}</td></tr>
//                 <tr><td>Standard Deduction</td><td>50000</td></tr>
//                 <tr><td>CHA-VIA Deductions</td><td>{selectedEmployee.totalChaVIA}</td></tr>
//                 <tr><td><strong>Total Taxable Income</strong></td><td><strong>{selectedEmployee.totalTaxableIncome}</strong></td></tr>
//               </tbody>
//             </table>
//             <button className="download-btn" onClick={handleDownload}>
//               Download PDF
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SalaryApp;


import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './SalaryApp.css';

const SalaryApp = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setEmployees(json);
    };
    reader.readAsArrayBuffer(file);
  };

  const calculateIncomeTax = (annualIncome) => {
    const taxableIncome = annualIncome - 50000;
    let tax = 0;

    const slabs = [
      { limit: 300000, rate: 0 },
      { limit: 600000, rate: 0.05 },
      { limit: 900000, rate: 0.1 },
      { limit: 1200000, rate: 0.15 },
      { limit: 1500000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 },
    ];

    let remaining = taxableIncome;
    let prevLimit = 0;

    for (const slab of slabs) {
      if (remaining <= 0) break;
      const taxableAtThisRate = Math.min(remaining, slab.limit - prevLimit);
      tax += taxableAtThisRate * slab.rate;
      remaining -= taxableAtThisRate;
      prevLimit = slab.limit;
    }

    return Math.round(tax / 12);
  };

  const calculateSalaryDetails = (baseSalary) => {
    const months = [
      'Apr-2024', 'May-2024', 'Jun-2024', 'Jul-2024', 'Aug-2024', 'Sep-2024',
      'Oct-2024', 'Nov-2024', 'Dec-2024', 'Jan-2025', 'Feb-2025', 'Mar-2025',
    ];

    const salary = Number(baseSalary);
    const da = Math.round(salary * 0.425);
    const hra = Math.round(salary * 0.16);
    const cca = 450;
    const others = 1800;
    const ndcps14 = Math.round((salary + da) * 0.14);
    const ndcps10 = Math.round((salary + da) * 0.10);
    const subGross1 = salary + da + hra + cca + ndcps14 + others;

    const daArrears = Math.round(da * 0.2);
    const subGross2 = daArrears;
    const grossIncome = subGross1 + subGross2;

    const lic = Math.round(grossIncome * 0.05);
    const profTax = 200;
    const fbf = 200;
    const annualIncome = grossIncome * 12;
    const incomeTax = calculateIncomeTax(annualIncome);

    const totalDeductions = lic + incomeTax + profTax + ndcps14 + ndcps10 + fbf;
    const netSalary = grossIncome - totalDeductions;

    const monthlyDetails = months.map((month) => ({
      month,
      salary,
      da,
      hra,
      cca,
      ndcps: ndcps14,
      others,
      subGross1,
      daArrears,
      subGross2,
      totalDeductions,
      netSalary,
    }));

    return {
      annualIncome,
      monthlyDetails,
      taxSummary: {
        totalIncome: annualIncome - 50000,
        deductionsVia: lic * 12,
        aggrDeductable: 200000,
        totalChaVIA: Math.min(150000 + 50000 + lic * 12, 200000),
        totalTaxableIncome: Math.max((annualIncome - 50000) - Math.min(150000 + 50000 + lic * 12, 200000), 0),
      }
    };
  };

  const handleGenerate = (employee) => {
    const details = calculateSalaryDetails(employee.BaseSalary);
    setSelectedEmployee({ ...employee, ...details });
  };

  const handleDownload = () => {
    if (!selectedEmployee) return;

    const emp = selectedEmployee;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Salary Slip - ${emp.Name}`, 14, 15);

    const head = [['Component', ...emp.monthlyDetails.map((m) => m.month)]];
    const body = [
      ['BASIC SALARY', ...emp.monthlyDetails.map((m) => m.salary)],
      ['DEARNESS ALLOWANCE', ...emp.monthlyDetails.map((m) => m.da)],
      ['HOUSE RENT ALLOWANCE', ...emp.monthlyDetails.map((m) => m.hra)],
      ['CITY COMPENSATE ALLOWANCE', ...emp.monthlyDetails.map((m) => m.cca)],
      ['NDCPS', ...emp.monthlyDetails.map((m) => m.ndcps)],
      ['OTHERS', ...emp.monthlyDetails.map((m) => m.others)],
      ['SUB GROSS SALARY-I', ...emp.monthlyDetails.map((m) => m.subGross1)],
      ['DA ARREARS', ...emp.monthlyDetails.map((m) => m.daArrears)],
      ['SUB GROSS SALARY-II', ...emp.monthlyDetails.map((m) => m.subGross2)],
      ['TOTAL DEDUCTIONS', ...emp.monthlyDetails.map((m) => m.totalDeductions)],
      ['NET SALARY', ...emp.monthlyDetails.map((m) => m.netSalary)],
    ];

    autoTable(doc, {
      startY: 25,
      head,
      body,
      styles: { fontSize: 8 },
    });

    doc.save(`${emp.Name}_SalarySlip.pdf`);
  };
  const capitalizeName = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  return (
    <div className="container">
      <div className="sidebar">
        <h2>Upload Employee Excel</h2>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        {employees.length > 0 && (
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Base Salary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={idx}>
                  <td>{emp.Name}</td>
                  <td>{emp.BaseSalary}</td>
                  <td>
                    <button onClick={() => handleGenerate(emp)}>Generate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="content">
        {selectedEmployee && (
          <div className="employee-details">
            <h2>Salary Details for {capitalizeName(selectedEmployee.Name)}</h2>
            <div className="table-scroll">
              <table className="salary-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    {selectedEmployee.monthlyDetails.map((m) => (
                      <th key={m.month}>{m.month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['salary', 'da', 'hra', 'cca', 'ndcps', 'others', 'subGross1', 'daArrears', 'subGross2', 'totalDeductions', 'netSalary'].map((comp) => (
                    <tr key={comp}>
                      <td>{comp.toUpperCase().replace(/([A-Z])/g, ' $1')}</td>
                      {selectedEmployee.monthlyDetails.map((m) => (
                        <td key={m.month}>{m[comp]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3>Annual Summary</h3>
            <table className="salary-table">
              <tbody>
                <tr><td>Total Salary Income</td><td>{selectedEmployee.annualIncome}</td></tr>
                <tr><td>Total Income</td><td>{selectedEmployee.taxSummary.totalIncome}</td></tr>
                <tr><td>Standard Deduction</td><td>50000</td></tr>
                <tr><td>CHA-VIA Deductions</td><td>{selectedEmployee.taxSummary.totalChaVIA}</td></tr>
                <tr><td><strong>Total Taxable Income</strong></td><td><strong>{selectedEmployee.taxSummary.totalTaxableIncome}</strong></td></tr>
              </tbody>
            </table>

            <button className="download-btn" onClick={handleDownload}>Download PDF</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryApp;
