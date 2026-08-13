import Card from "../../ui/Card";
import { Database, HardDrive } from "lucide-react";

const StorageCard = ({ storage }) => {
  const usedGB = Number(storage?.usedGB ?? 0);
  const limitGB = Number(storage?.limitGB ?? 5);
  const percentage = Number(storage?.percentage ?? 0);

  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <Card hover={false}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Storage Usage
          </h2>

          <p className="mt-1 text-sm leading-6 text-zinc-500">
            Track your workspace storage.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
          <Database size={20} />
        </div>
      </div>

      {/* Storage */}
      <div className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-zinc-300">
            Storage used
          </span>

          <span className="text-sm font-semibold text-white">
            {safePercentage.toFixed(2)}%
          </span>
        </div>

        {/* Progress */}
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              transition-all
              duration-700
            "
            style={{
              width: `${safePercentage}%`,
            }}
          />
        </div>

        {/* Usage */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <HardDrive size={15} />

            <span>
              {usedGB} GB of {limitGB} GB used
            </span>
          </div>

          <span className="text-xs text-zinc-600">
            {Math.max(limitGB - usedGB, 0).toFixed(2)} GB free
          </span>
        </div>
      </div>
    </Card>
  );
};

export default StorageCard;