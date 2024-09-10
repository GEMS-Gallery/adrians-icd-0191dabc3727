export const idlFactory = ({ IDL }) => {
  const Result_2 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Nat, IDL.Nat),
    'err' : IDL.Text,
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Nat, IDL.Nat, IDL.Nat),
    'err' : IDL.Text,
  });
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Float64, IDL.Float64, IDL.Float64),
    'err' : IDL.Text,
  });
  return IDL.Service({
    'getGovernanceData' : IDL.Func([], [Result_2], ['query']),
    'getHistoricalData' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Int, IDL.Float64, IDL.Nat))],
        ['query'],
      ),
    'getNetworkStats' : IDL.Func([], [Result_1], ['query']),
    'getTokenMetrics' : IDL.Func([], [Result], ['query']),
    'updateDashboard' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
