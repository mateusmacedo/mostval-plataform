import { BaseMessage } from './Message';

type MessagePayloadPropsSpec = {
  dummyProp: string;
};

type MessageMetadataPropsSpec = {
  correlationId: string;
};

class MessageSpec extends BaseMessage<MessagePayloadPropsSpec, MessageMetadataPropsSpec> {}

describe('MessageSpec', () => {
  let messageSpec: MessageSpec;
  let payload: MessagePayloadPropsSpec;
  let metadata: MessageMetadataPropsSpec;
  beforeEach(async () => {
    payload = {
      dummyProp: 'test',
    };
    metadata = {
      correlationId: 'test',
    };
    messageSpec = new MessageSpec({
      id: 'test',
      type: 'test',
      payload,
      metadata,
      timestamp: Date.now(),
    });
  });

  it('should be defined', () => {
    expect(messageSpec).toBeDefined();
  });

  it('should return the id', () => {
    expect(messageSpec.id).toEqual('test');
  });

  it('should return the type', () => {
    expect(messageSpec.type).toEqual('test');
  });

  it('should return the payload', () => {
    expect(messageSpec.payload).toEqual(payload);
  });

  it('should return the metadata', () => {
    expect(messageSpec.metadata).toEqual(metadata);
  });

  it('should return the timestamp', () => {
    expect(messageSpec.timestamp).toBeDefined();
  });
});
