// types/user.ts

import type { Superadmin } from './superadmin';
import type { Admin } from './admin';
import type { Teacher } from './teacher';
import type { Customer } from './customer';

export type UserRole = "superadmin" | "admin" | "teacher" | "customer" | null;

export type UserData = Superadmin | Admin | Teacher | Customer;
