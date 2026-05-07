import sequelize from '../config/database';
import { User, initUser } from './User';
import { Repository, initRepository } from './Repository';
import { Scan, initScan } from './Scan';
import { ScanResult, initScanResult } from './ScanResult';
import { AuditLog, initAuditLog } from './AuditLog';

initUser(sequelize);
initRepository(sequelize);
initScan(sequelize);
initScanResult(sequelize);
initAuditLog(sequelize);

// Repository ↔ Scan
Repository.hasMany(Scan, { foreignKey: 'repositoryId', as: 'scans' });
Scan.belongsTo(Repository, { foreignKey: 'repositoryId', as: 'repository' });

// Scan ↔ ScanResult
Scan.hasMany(ScanResult, { foreignKey: 'scanId', as: 'results' });
ScanResult.belongsTo(Scan, { foreignKey: 'scanId', as: 'scan' });

// User ↔ Scan (triggeredBy)
User.hasMany(Scan, { foreignKey: 'triggeredBy', as: 'triggeredScans' });
Scan.belongsTo(User, { foreignKey: 'triggeredBy', as: 'triggeredByUser' });

// User ↔ AuditLog
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Repository, Scan, ScanResult, AuditLog, sequelize };
