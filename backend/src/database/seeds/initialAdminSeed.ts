// import { Admin } from 'src/admin/entities/admin.entity';
// import { DataSource } from 'typeorm';
// import { Seeder, SeederFactoryManager } from 'typeorm-extension';

// export class InitialCustomerData implements Seeder {
//   public async run(
//     dataSource: DataSource,
//     factoryManager: SeederFactoryManager,
//   ): Promise<any> {
//     const adminRepository = dataSource.getRepository(Admin);

//     const existingAdmins = await adminRepository.find();
//     if (existingAdmins.length > 0) {
//       console.log('Admin already exist, skipping seeding.');
//       return;
//     }

//     const adminData = [
//       {
//         adminName: 'John Snow',
//         uniqueAdminId: 'admin-001',
//       },
//     ];

//     await adminRepository.save(adminData);
//     console.log('Admin Seeding successful!');
//   }

//   public async revert(dataSource: DataSource): Promise<any> {
//     const adminRepository = dataSource.getRepository(Admin);
//     await adminRepository.clear();
//     console.log('Admin data cleared.');
//   }
// }
