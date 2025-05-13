'use client'
import React, {useRef, useState} from 'react';

const StockDashboard = () => {
    const [selectedRisk, setSelectedRisk] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Complete CSV data converted to JSON array
    const stockData = [
        { Symbol: 'MTL', Closing_Price: 0.069, Risk_Score: 0.846830341, Risk_Category: 'High' },
        { Symbol: 'MPCCEL', Closing_Price: 0.3999, Risk_Score: 0.845463788, Risk_Category: 'High' },
        { Symbol: 'TJH', Closing_Price: 0.0251, Risk_Score: 0.846679193, Risk_Category: 'High' },
        { Symbol: 'PROVEN', Closing_Price: 0.1099, Risk_Score: 0.845913029, Risk_Category: 'High' },
        { Symbol: 'SIL', Closing_Price: 0.0182, Risk_Score: 0.846656332, Risk_Category: 'High' },
        { Symbol: 'ASBH', Closing_Price: 0.269, Risk_Score: 0.845661800, Risk_Category: 'High' },
        { Symbol: 'KEY', Closing_Price: 2.54, Risk_Score: 0.908745300, Risk_Category: 'High' },
        { Symbol: 'MJE', Closing_Price: 8.9, Risk_Score: 0.884454494, Risk_Category: 'High' },
        { Symbol: 'MEEG', Closing_Price: 9.52, Risk_Score: 0.862571011, Risk_Category: 'High' },
        { Symbol: 'MDS', Closing_Price: 1.72, Risk_Score: 0.897113990, Risk_Category: 'High' },
        { Symbol: 'MAILPAC', Closing_Price: 2.34, Risk_Score: 0.884784535, Risk_Category: 'High' },
        { Symbol: 'LASF', Closing_Price: 1.71, Risk_Score: 0.901400186, Risk_Category: 'High' },
        { Symbol: 'KREMI', Closing_Price: 2.2, Risk_Score: 0.868352532, Risk_Category: 'High' },
        { Symbol: 'KLE', Closing_Price: 1.15, Risk_Score: 0.916272144, Risk_Category: 'High' },
        { Symbol: '138SL', Closing_Price: 3.45, Risk_Score: 0.859432279, Risk_Category: 'High' },
        { Symbol: '138SLVR', Closing_Price: 232.85, Risk_Score: 0.900314888, Risk_Category: 'High' },
        { Symbol: 'JMMBUS6.00', Closing_Price: 1.02, Risk_Score: 0.2, Risk_Category: 'Low' },
        { Symbol: 'JMMB7.50', Closing_Price: 1.0, Risk_Score: 0.2, Risk_Category: 'Low' },
        { Symbol: 'JFP', Closing_Price: 0.58, Risk_Score: 0.896197068, Risk_Category: 'High' },
        { Symbol: 'JETCON', Closing_Price: 0.92, Risk_Score: 0.899425207, Risk_Category: 'High' },
        { Symbol: 'ISP', Closing_Price: 8.7, Risk_Score: 0.916048411, Risk_Category: 'High' },
        { Symbol: 'GWEST', Closing_Price: 0.76, Risk_Score: 0.872144877, Risk_Category: 'High' },
        { Symbol: 'FIRSTROCKUSD', Closing_Price: 0.018, Risk_Score: 0.946285521, Risk_Category: 'High' },
        { Symbol: 'FIRSTROCKJMD', Closing_Price: 9.6, Risk_Score: 0.878504666, Risk_Category: 'High' },
        { Symbol: 'JMMBGLUSD8.50', Closing_Price: 1.1, Risk_Score: 0.902545439, Risk_Category: 'High' },
        { Symbol: 'PAL', Closing_Price: 1.0, Risk_Score: 0.906066082, Risk_Category: 'High' },
        { Symbol: 'ONE', Closing_Price: 0.94, Risk_Score: 0.926879681, Risk_Category: 'High' },
        { Symbol: 'SCIUSD8.50E', Closing_Price: 10.0, Risk_Score: 0.898138663, Risk_Category: 'High' },
        { Symbol: 'TROPICAL', Closing_Price: 2.04, Risk_Score: 0.965572472, Risk_Category: 'High' },
        { Symbol: 'TJH8.0', Closing_Price: 1.8, Risk_Score: 0.866343599, Risk_Category: 'High' },
        { Symbol: 'SRFUSD', Closing_Price: 0.0801, Risk_Score: 0.984964991, Risk_Category: 'High' },
        { Symbol: 'SPURTREE', Closing_Price: 1.23, Risk_Score: 0.943479614, Risk_Category: 'High' },
        { Symbol: 'SOS', Closing_Price: 1.48, Risk_Score: 0.834408700, Risk_Category: 'High' },
        { Symbol: 'SELECTMD', Closing_Price: 0.78, Risk_Score: 0.931304230, Risk_Category: 'High' },
        { Symbol: 'SELECTF', Closing_Price: 0.45, Risk_Score: 0.865833177, Risk_Category: 'High' },
        { Symbol: 'SCIUSD8.00D', Closing_Price: 8.62, Risk_Score: 0.888615609, Risk_Category: 'High' },
        { Symbol: 'EPLY7.75', Closing_Price: 20.0, Risk_Score: 0.909072917, Risk_Category: 'High' },
        { Symbol: 'SCIJMD10.50C', Closing_Price: 100.5, Risk_Score: 0.859790058, Risk_Category: 'High' },
        { Symbol: 'RPL', Closing_Price: 3.5, Risk_Score: 0.894364016, Risk_Category: 'High' },
        { Symbol: 'RJR', Closing_Price: 1.2, Risk_Score: 0.908354818, Risk_Category: 'High' },
        { Symbol: 'PURITY', Closing_Price: 1.75, Risk_Score: 0.883398626, Risk_Category: 'High' },
        { Symbol: 'PULS', Closing_Price: 0.96, Risk_Score: 0.916451685, Risk_Category: 'High' },
        { Symbol: 'PTL', Closing_Price: 1.03, Risk_Score: 0.895283726, Risk_Category: 'High' },
        { Symbol: 'PJX', Closing_Price: 10.5, Risk_Score: 0.868151125, Risk_Category: 'High' },
        { Symbol: 'FESCO', Closing_Price: 3.07, Risk_Score: 0.910348380, Risk_Category: 'High' },
        { Symbol: 'XFUND', Closing_Price: 8.59, Risk_Score: 0.894575190, Risk_Category: 'High' },
        { Symbol: 'CPJ', Closing_Price: 8.02, Risk_Score: 0.932828758, Risk_Category: 'High' },
        { Symbol: '1GS', Closing_Price: 0.41, Risk_Score: 0.882266660, Risk_Category: 'High' },
        { Symbol: 'CAC', Closing_Price: 1.94, Risk_Score: 0.921470900, Risk_Category: 'High' },
        { Symbol: 'EFRESH', Closing_Price: 2.07, Risk_Score: 0.885170228, Risk_Category: 'High' },
        { Symbol: 'ELITE', Closing_Price: 1.26, Risk_Score: 0.922439058, Risk_Category: 'High' },
        { Symbol: 'DTL', Closing_Price: 1.9, Risk_Score: 0.876860752, Risk_Category: 'High' },
        { Symbol: 'EPLY7.25', Closing_Price: 20.0, Risk_Score: 0.861338231, Risk_Category: 'High' },
        { Symbol: 'ENERGY', Closing_Price: 1.24, Risk_Score: 0.961463390, Risk_Category: 'High' },
        { Symbol: 'BRG', Closing_Price: 7.75, Risk_Score: 0.881116118, Risk_Category: 'High' },
        { Symbol: 'FOSRICH', Closing_Price: 2.55, Risk_Score: 0.899879608, Risk_Category: 'High' },
        { Symbol: 'QWI', Closing_Price: 0.76, Risk_Score: 0.916313031, Risk_Category: 'High' },
        { Symbol: 'LAB', Closing_Price: 1.18, Risk_Score: 0.868587823, Risk_Category: 'High' },
        { Symbol: 'JAMT', Closing_Price: 2.39, Risk_Score: 0.871156675, Risk_Category: 'High' },
        { Symbol: 'JBG', Closing_Price: 28.95, Risk_Score: 0.961806320, Risk_Category: 'High' },
        { Symbol: 'DCOVE', Closing_Price: 14.09, Risk_Score: 0.953473735, Risk_Category: 'High' },
        { Symbol: 'JMMBGL', Closing_Price: 20.69, Risk_Score: 0.904358053, Risk_Category: 'High' },
        { Symbol: 'SRFJMD', Closing_Price: 8.0, Risk_Score: 0.876070946, Risk_Category: 'High' },
        { Symbol: 'IPCL', Closing_Price: 0.99, Risk_Score: 0.905463807, Risk_Category: 'High' },
        { Symbol: 'AMG', Closing_Price: 2.6, Risk_Score: 0.901586228, Risk_Category: 'High' },
        { Symbol: 'KEX', Closing_Price: 14.44, Risk_Score: 0.867254175, Risk_Category: 'High' },
        { Symbol: 'SML', Closing_Price: 6.77, Risk_Score: 0.869031218, Risk_Category: 'High' },
        { Symbol: 'JP', Closing_Price: 24.5, Risk_Score: 0.893345710, Risk_Category: 'High' },
        { Symbol: 'WIG', Closing_Price: 1.22, Risk_Score: 0.950164289, Risk_Category: 'High' },
        { Symbol: 'LASD', Closing_Price: 4.3, Risk_Score: 0.892877555, Risk_Category: 'High' },
        { Symbol: 'BIL', Closing_Price: 71.23, Risk_Score: 0.739260416, Risk_Category: 'High' },
        { Symbol: 'SCIJMD', Closing_Price: 12.24, Risk_Score: 0.863758405, Risk_Category: 'High' },
        { Symbol: 'FTNA', Closing_Price: 9.01, Risk_Score: 0.827805862, Risk_Category: 'High' },
        { Symbol: 'CCC', Closing_Price: 83.59, Risk_Score: 0.805749356, Risk_Category: 'High' },
        { Symbol: 'GENAC', Closing_Price: 5.25, Risk_Score: 0.855783660, Risk_Category: 'High' },
        { Symbol: 'CFF', Closing_Price: 1.25, Risk_Score: 0.869169343, Risk_Category: 'High' },
        { Symbol: 'CABROKERS', Closing_Price: 2.46, Risk_Score: 0.875312086, Risk_Category: 'High' },
        { Symbol: 'BPOW', Closing_Price: 5.19, Risk_Score: 0.909813542, Risk_Category: 'High' },
        { Symbol: 'LUMBER', Closing_Price: 2.95, Risk_Score: 0.906495557, Risk_Category: 'High' },
        { Symbol: 'LASM', Closing_Price: 7.46, Risk_Score: 0.880978027, Risk_Category: 'High' },
        { Symbol: 'MGL', Closing_Price: 7.48, Risk_Score: 0.865799745, Risk_Category: 'High' },
        { Symbol: 'ECL', Closing_Price: 2.94, Risk_Score: 0.863093603, Risk_Category: 'High' },
        { Symbol: 'SALF', Closing_Price: 3.24, Risk_Score: 0.884698971, Risk_Category: 'High' },
        { Symbol: 'SEP', Closing_Price: 84.14, Risk_Score: 0.752502226, Risk_Category: 'High' },
        { Symbol: 'DOLLA', Closing_Price: 2.52, Risk_Score: 0.930639755, Risk_Category: 'High' },
        { Symbol: 'SCIUSD', Closing_Price: 0.07, Risk_Score: 0.880661031, Risk_Category: 'High' },
        { Symbol: 'JSE', Closing_Price: 12.69, Risk_Score: 0.853139163, Risk_Category: 'High' },
        { Symbol: 'KW', Closing_Price: 26.48, Risk_Score: 0.881872772, Risk_Category: 'High' },
        { Symbol: 'CHL', Closing_Price: 10.96, Risk_Score: 0.892151755, Risk_Category: 'High' },
        { Symbol: 'SJ', Closing_Price: 44.0, Risk_Score: 0.641513002, Risk_Category: 'High' },
        { Symbol: 'INDIES', Closing_Price: 3.56, Risk_Score: 0.907684395, Risk_Category: 'High' },
        { Symbol: 'WISYNCO', Closing_Price: 21.29, Risk_Score: 0.579295089, Risk_Category: 'Moderate' },
        { Symbol: 'HONBUN', Closing_Price: 8.39, Risk_Score: 0.877352609, Risk_Category: 'High' },
        { Symbol: 'GHL', Closing_Price: 338.03, Risk_Score: 0.889511596, Risk_Category: 'High' },
        { Symbol: 'VMIL', Closing_Price: 2.2, Risk_Score: 0.879169561, Risk_Category: 'High' },
        { Symbol: 'EPLY', Closing_Price: 33.33, Risk_Score: 0.887625450, Risk_Category: 'High' },
        { Symbol: 'AFS', Closing_Price: 17.29, Risk_Score: 0.872610068, Risk_Category: 'High' },
        { Symbol: 'CAR', Closing_Price: 16.06, Risk_Score: 0.761609219, Risk_Category: 'High' },
        { Symbol: 'MASSY', Closing_Price: 78.53, Risk_Score: 0.901530604, Risk_Category: 'High' },
        { Symbol: 'KPREIT', Closing_Price: 9.54, Risk_Score: 0.878732411, Risk_Category: 'High' },
        { Symbol: 'SVL', Closing_Price: 19.93, Risk_Score: 0.918525973, Risk_Category: 'High' },
        { Symbol: 'SGJ', Closing_Price: 53.19, Risk_Score: 0.839769975, Risk_Category: 'High' },
        { Symbol: 'NCBFG', Closing_Price: 44.67, Risk_Score: 0.876862877, Risk_Category: 'High' },
        { Symbol: 'JPS6', Closing_Price: 0.59, Risk_Score: 0.377455206, Risk_Category: 'Moderate' },
        { Symbol: 'JPS9.5', Closing_Price: 2690.0, Risk_Score: 0.804928878, Risk_Category: 'High' },
        { Symbol: 'GK', Closing_Price: 71.55, Risk_Score: 0.537741903, Risk_Category: 'Moderate' },
        { Symbol: 'JPS7', Closing_Price: 44.5, Risk_Score: 0.877487888, Risk_Category: 'High' },
        { Symbol: 'JMMBGL9.50', Closing_Price: 1.05, Risk_Score: 0.903170056, Risk_Category: 'High' },
        { Symbol: 'CPFV', Closing_Price: 36.68, Risk_Score: 0.873105688, Risk_Category: 'High' },
        { Symbol: 'JPS5D', Closing_Price: 0.83, Risk_Score: 0.490125900, Risk_Category: 'Moderate' },
        { Symbol: 'LEARN', Closing_Price: 0.26, Risk_Score: 0.912889356, Risk_Category: 'High' },
        { Symbol: 'JPS5C', Closing_Price: 0.45, Risk_Score: 0.2, Risk_Category: 'Low' },
        { Symbol: 'JMMBGL7.35', Closing_Price: 2.9, Risk_Score: 0.778656102, Risk_Category: 'High' },
        { Symbol: 'PJAM', Closing_Price: 51.53, Risk_Score: 0.836717564, Risk_Category: 'High' },
        { Symbol: 'ROC', Closing_Price: 3.7, Risk_Score: 0.940288124, Risk_Category: 'High' },
        { Symbol: 'JMMBGL7.15', Closing_Price: 2.96, Risk_Score: 0.855623624, Risk_Category: 'High' },
        { Symbol: 'OMNI', Closing_Price: 0.87, Risk_Score: 0.905140866, Risk_Category: 'High' },
        { Symbol: 'MFS', Closing_Price: 0.43, Risk_Score: 0.890399859, Risk_Category: 'High' },
        { Symbol: 'TTECH', Closing_Price: 1.44, Risk_Score: 0.896078248, Risk_Category: 'High' },
        { Symbol: 'JMMBGL7.00NC', Closing_Price: 2.28, Risk_Score: 0.910446452, Risk_Category: 'High' },
        { Symbol: 'JMMBGL5.50NC', Closing_Price: 2.0, Risk_Score: 0.772521729, Risk_Category: 'High' },
        { Symbol: 'JMMBGL5.75C', Closing_Price: 2.05, Risk_Score: 0.892954615, Risk_Category: 'High' },
        { Symbol: 'JMMBGL7.25C', Closing_Price: 1.99, Risk_Score: 0.814715533, Risk_Category: 'High' },
        { Symbol: 'RAWILL', Closing_Price: 0.55, Risk_Score: 0.890259401, Risk_Category: 'High' },
        { Symbol: 'ASBH6.00  (XD)', Closing_Price: 1.0, Risk_Score: 0.2, Risk_Category: 'Low' },
        { Symbol: 'PBS', Closing_Price: 1.38, Risk_Score: 0.989325358, Risk_Category: 'High' },
        { Symbol: 'PBS10.50', Closing_Price: 1060.0, Risk_Score: 0.899002690, Risk_Category: 'High' },
        { Symbol: 'PBS9.25', Closing_Price: 10.46, Risk_Score: 0.873114875, Risk_Category: 'High' },
        { Symbol: 'EPLY7.50', Closing_Price: 5.41, Risk_Score: 0.874190855, Risk_Category: 'High' },
        { Symbol: 'ICREATE', Closing_Price: 0.4, Risk_Score: 0.885240389, Risk_Category: 'High' },
        { Symbol: 'KNTYR', Closing_Price: 0.31, Risk_Score: 0.939979186, Risk_Category: 'High' },
    ];

    // Get first three stocks for initial display
    const filteredStocks = stockData.filter(stock => {
        const matchesSearch = stock.Symbol.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = selectedRisk === 'All' || stock.Risk_Category === selectedRisk;
        return matchesSearch && matchesRisk;
    });

    const getRiskColor = (category: string) => {
        switch(category) {
            case 'High': return '#ff4757';
            case 'Moderate': return '#ffa502';
            case 'Low': return '#2ed573';
            default: return '#2f3542';
        }
    };

    // Styles object
    const styles = {
        dashboardContainer: {
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif',
        },
        headerSection: {
            background: '#f1f2f6',
            padding: '2rem',
            borderRadius: '10px',
            marginBottom: '2rem',
        },
        metricsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            marginTop: '1rem',
        },
        controlsSection: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '2rem',
        },
        searchInput: {
            padding: '0.8rem',
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '5px',
        },
        riskButton: {
            padding: '0.5rem 1rem',
            marginLeft: '1rem',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            background: '#f1f2f6',
        },
        activeRiskButton: {
            background: '#2ed573',
            color: 'white',
        },
        tableContainer: {
            overflowX: 'auto' as const,
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            background: 'white',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse' as const,
        },
        tableHeader: {
            background: '#f8f9fa',
            borderBottom: '2px solid #e9ecef',
        },
        headerCell: {
            padding: '1rem',
            textAlign: 'left' as const,
            fontWeight: '600',
            color: '#2f3542',
        },
        tableRow: {
            borderBottom: '1px solid #e9ecef',
            '&:hover': {
                background: '#f8f9fa',
            },
        },
        tableCell: {
            padding: '1rem',
            color: '#2f3542',
        },
        riskBadge: {
            padding: '0.3rem 0.8rem',
            borderRadius: '15px',
            color: 'white',
            fontSize: '0.8rem',
            display: 'inline-block',
        },
        uploadButton: {
            backgroundColor: '#2ed573',
            color: 'white',
            padding: '0.8rem 1.5rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '1rem',
            transition: 'background-color 0.3s',
        },
        statusMessage: {
            marginTop: '1rem',
            color: '#2ed573',
            fontWeight: 'bold',
        },
        errorMessage: {
            color: '#ff4757',
        }
    };

    return (
        <div style={styles.dashboardContainer}>
            {/* Header Section */}
            <div style={styles.headerSection}>
                <div>
                    <div style={styles.metricsGrid}>
                        <div>
                            <h2>RISK EXPOSURE</h2>
                            <p>Low</p>
                        </div>
                        <div>
                            <h2>DRASTIC THRESHOLD</h2>
                            <p>20%</p>
                        </div>
                        <div>

                        </div>
                        <div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div style={styles.controlsSection}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search stocks..."
                        style={styles.searchInput}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    {['All', 'High', 'Moderate', 'Low'].map(risk => (
                        <button
                            key={risk}
                            style={{
                                ...styles.riskButton,
                                ...(selectedRisk === risk ? styles.activeRiskButton : {})
                            }}
                            onClick={() => setSelectedRisk(risk)}
                        >
                            {risk} Risk
                        </button>
                    ))}
                </div>
            </div>
            {/* Add status message display */}
            {uploadStatus && (
                <div style={{
                    ...styles.statusMessage,
                    ...(uploadStatus.startsWith('Error') ? styles.errorMessage : {})
                }}>
                    {uploadStatus}
                </div>
            )}

            {/* Stock Grid */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.tableHeader}>
                    <tr>
                        <th style={styles.headerCell}>Symbol</th>
                        <th style={styles.headerCell}>Risk Category</th>
                        <th style={styles.headerCell}>Price</th>
                        <th style={styles.headerCell}>Risk Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredStocks.map((stock) => (
                        <tr key={stock.Symbol} style={styles.tableRow}>
                            <td style={styles.tableCell}>{stock.Symbol}</td>
                            <td style={styles.tableCell}>
                                    <span style={{
                                        ...styles.riskBadge,
                                        backgroundColor: getRiskColor(stock.Risk_Category)
                                    }}>
                                        {stock.Risk_Category} Risk
                                    </span>
                            </td>
                            <td style={styles.tableCell}>J${stock.Closing_Price.toFixed(2)}</td>
                            <td style={styles.tableCell}>{stock.Risk_Score.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockDashboard;