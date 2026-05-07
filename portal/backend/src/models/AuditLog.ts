import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export interface AuditLogAttributes {
  id: string;
  userId: string | null;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt?: Date;
}

type AuditLogCreationAttributes = Optional<
  AuditLogAttributes,
  'id' | 'userId' | 'resourceType' | 'resourceId' | 'metadata' | 'ipAddress'
>;

export class AuditLog
  extends Model<AuditLogAttributes, AuditLogCreationAttributes>
  implements AuditLogAttributes
{
  declare id: string;
  declare userId: string | null;
  declare action: string;
  declare resourceType: string | null;
  declare resourceId: string | null;
  declare metadata: Record<string, unknown> | null;
  declare ipAddress: string | null;
  declare readonly createdAt: Date;
}

export function initAuditLog(sequelize: Sequelize): void {
  AuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resourceType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resourceId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'audit_logs',
      timestamps: true,
      updatedAt: false,
    }
  );
}
