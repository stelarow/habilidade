/**
 * SchedulerService - TEMPORARILY DISABLED
 * This service will be re-enabled when EmailAutomationService is implemented
 */

import * as cron from "node-cron";
import { createClient } from "@/lib/supabase/client";

export class SchedulerService {
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();
  private supabase = createClient();

  constructor() {
    console.log("SchedulerService temporarily disabled");
  }

  public async startScheduler(): Promise<void> {
    console.log("SchedulerService temporarily disabled");
  }

  public async stopScheduler(): Promise<void> {
    console.log("SchedulerService temporarily disabled");
  }

  public async getScheduledTasks(): Promise<any[]> {
    console.log("SchedulerService temporarily disabled");
    return [];
  }
}

let schedulerInstance: SchedulerService | null = null;

export function getSchedulerService(): SchedulerService {
  if (!schedulerInstance) {
    schedulerInstance = new SchedulerService();
  }
  return schedulerInstance;
}
