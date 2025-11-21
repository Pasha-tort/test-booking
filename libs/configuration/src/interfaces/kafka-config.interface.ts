export interface IKafkaConfig {
  kafka: {
    clientId: string;
    brokers: string[];
  };
}
