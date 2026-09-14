interface GreetingHeaderProps {
  firstName?: string;
}

export function GreetingHeader({ firstName = "Pristia" }: GreetingHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Hi, {firstName}</h1>
      <p className="mt-1 text-sm text-gray-500">
        This is your HR report so far
      </p>
    </div>
  );
}
