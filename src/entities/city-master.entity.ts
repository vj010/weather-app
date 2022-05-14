import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('CITY_MASTER')
export class CityMaster {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'STATE' })
  state: string;
  @Column({ name: 'COUNTRY' })
  country: string;

  @Column({ name: 'LONGITUDE' })
  longitude: number;

  @Column({ name: 'LATITUDE' })
  latutitude: number;

  @CreateDateColumn({ name: 'CREATION_TSTAMP' })
  creationTimestamp: Date;

  @UpdateDateColumn({ name: 'MODIFICATION_TSTAMP' })
  modificationTimestamp: Date;
}
