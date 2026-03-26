import { Panel, SetupTopbar } from "@/components/ui";
import type { EmployeeDetailRecord } from "./data";

type EmployeeDetailPageProps = {
  detail: EmployeeDetailRecord;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
        {label}
      </p>
      <p className="mt-2 text-[15px] leading-[1.6] text-text-primary">
        {value}
      </p>
    </div>
  );
}

export function EmployeeDetailPage({ detail }: EmployeeDetailPageProps) {
  const { employee, branchAccess } = detail;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="w-full">
        <SetupTopbar
          backHref="/staff-roles"
          backLabel="Back to employees"
          showCancel={false}
          showProceed={false}
        />
      </div>

      <div className="mx-auto w-full max-w-[1120px]">
        <Panel eyebrow="Profile" title={employee.name}>
          <div className="grid gap-5 md:grid-cols-2">
            <DetailRow label="Employee code" value={employee.employeeCode} />
            <DetailRow label="Status" value={employee.status} />
            <DetailRow label="Role" value={employee.role} />
            <DetailRow label="Team" value={employee.team} />
            <DetailRow label="Email address" value={employee.email} />
            <DetailRow label="Phone number" value={employee.phone} />
          </div>
        </Panel>

        <Panel
          className="mt-4"
          eyebrow="Branch"
          title="Branch assignment"
          description="Branches this employee is currently listed under."
        >
          <div className="flex flex-wrap gap-2">
            {branchAccess.map((branch) => (
              <span
                key={branch}
                className="inline-flex rounded-full bg-bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-text-brand"
              >
                {branch}
              </span>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
