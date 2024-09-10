import Hash "mo:base/Hash";
import Nat "mo:base/Nat";

import Float "mo:base/Float";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Text "mo:base/Text";

actor {
  // Stable variables
  stable var token_metrics : ?(Float, Float, Float) = null;
  stable var network_stats : ?(Nat, Nat, Nat) = null;
  stable var governance_data : ?(Nat, Nat) = null;
  stable var historical_data : [(Int, Float, Nat)] = [];

  // Mutable variable
  var last_update : Int = 0;

  // Helper function to simulate data fetching
  func fetchData() : async () {
    // Simulating data fetching
    token_metrics := ?(45000.0, 10000000000.0, 500000000.0);
    network_stats := ?(100000, 50, 1000);
    governance_data := ?(20, 50000);
    
    let current_time = Time.now();
    historical_data := Array.append(historical_data, [(current_time, Option.get(token_metrics, (0.0, 0.0, 0.0)).0, Option.get(network_stats, (0, 0, 0)).0)]);
    
    if (Array.size(historical_data) > 30) {
      historical_data := Iter.toArray(Array.slice(historical_data, Array.size(historical_data) - 30, Array.size(historical_data)));
    };
    
    last_update := current_time;
  };

  public query func getTokenMetrics() : async Result.Result<(Float, Float, Float), Text> {
    switch (token_metrics) {
      case (null) { #err("Data not available") };
      case (?metrics) { #ok(metrics) };
    }
  };

  public query func getNetworkStats() : async Result.Result<(Nat, Nat, Nat), Text> {
    switch (network_stats) {
      case (null) { #err("Data not available") };
      case (?stats) { #ok(stats) };
    }
  };

  public query func getGovernanceData() : async Result.Result<(Nat, Nat), Text> {
    switch (governance_data) {
      case (null) { #err("Data not available") };
      case (?data) { #ok(data) };
    }
  };

  public query func getHistoricalData() : async [(Int, Float, Nat)] {
    historical_data
  };

  public shared func updateDashboard() : async () {
    await fetchData();
  };

  // System functions
  system func preupgrade() {
    // Data is already in stable variables
  };

  system func postupgrade() {
    // Data is already in stable variables
  };
}
