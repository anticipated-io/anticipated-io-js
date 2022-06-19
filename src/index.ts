import * as https from 'https'
import { DateTime } from 'luxon'

interface WebHookDetails<Document> {
  method: 'post' | 'get' | 'put' | 'delete'
  url: string
  document: Document
  headers?: { [key: string]: string }
  username?: string
  password?: string
}

type JsonDetails<Document> = WebHookDetails<Document>

interface SqsDetails<Document> {
  url: string
  document: Document
}

interface XmlDetails extends Omit<WebHookDetails<Document>, 'document'> {
  document: string
}

interface JsonRequest<Document> {
  when: string
  details: JsonDetails<Document>
}

interface XmlRequest {
  when: string
  details: XmlDetails
}

interface SqsRequest<Document> {
  when: string
  details: SqsDetails<Document>
}

interface Event {
  id: string
  company: string
  when: string
  type: 'json' | 'xml' | 'sqs'
  created: string
  processed: boolean
  deleted: boolean
  statusCode: number
}

export interface JsonEvent<Document> extends Event {
  details: WebHookDetails<Document>
}
export interface XmlEvent extends Event {
  details: WebHookDetails<string>
}
export interface SqsEvent<Document> extends Event {
  details: SqsDetails<Document>
}

type Request<Document> = JsonRequest<Document> | XmlRequest | SqsRequest<Document>

interface JsonResponse<Document> {
  now: DateTime
  event: JsonEvent<Document>
}
interface XmlResponse {
  now: DateTime
  event: XmlEvent
}
interface SqsResponse<Document> {
  now: DateTime
  event: SqsEvent<Document>
}

interface ApiCreateResponse {
  request: {
    id: string
  }
  context: {
    user: string | null
    company: string | null
  }
  now: string
}
interface ApiCreateJsonResponse<Document> extends ApiCreateResponse {
  event: JsonEvent<Document>
}
interface ApiCreateXmlResponse extends ApiCreateResponse {
  event: XmlEvent
}
interface ApiCreateSqsResponse<Document> extends ApiCreateResponse {
  event: SqsEvent<Document>
}

interface EventResponse {
  statusCode: number
  headers: { [key: string]: string }
  body: string
  date: string
}

interface AnticipatedEventsOptions {
  key: string
}

class AnticipatedEvents<Document> {
  private _key = ''
  constructor(options: AnticipatedEventsOptions) {
    this._key = options.key
  }

  private async create(type: 'json' | 'xml' | 'sqs', r: Request<Document>): Promise<string> {
    const request = JSON.stringify({...r,type})
    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'dev-api.anticipated.io',
          method: 'POST',
          path: '/v1/event',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': request.length,
            'x-api-key': this._key
          }
        },
        (response) => {
          let responseBody = ''
          response.on('data', (chunk) => (responseBody += chunk))
          response.on('end', () => {
            if (response.statusCode && (response.statusCode < 200 || response.statusCode > 299)) {
              reject(JSON.parse(responseBody).message)
            }
            resolve(responseBody)
          })
        }
      )
      req.on('error', (error) => {
        reject(error)
      })
      req.write(request)
      req.end()
    })
  }

  public async createJson({ when, details }: JsonRequest<Document>): Promise<JsonResponse<Document>> {
    return this.create('json', {
      when,
      details
    })
      .then((response) => {
        const result = JSON.parse(response) as ApiCreateJsonResponse<Document>
        return {
          now: DateTime.fromISO(result.now),
          event: result.event
        }
      })
  }

  public async createXml({ when, details }: XmlRequest): Promise<XmlResponse> {
    return this.create('xml', {
      when,
      details
    })
      .then((response) => {
        const result = JSON.parse(response) as ApiCreateXmlResponse
        return {
          now: DateTime.fromISO(result.now),
          event: result.event
        }
      })
  }

  public async createSqs({ when, details }: SqsRequest<Document>): Promise<SqsResponse<Document>> {
    return this.create('sqs', {
      when,
      details
    })
      .then((response) => {
        const result = JSON.parse(response) as ApiCreateSqsResponse<Document>
        return {
          now: DateTime.fromISO(result.now),
          event: result.event
        }
      })
  }

  public async get(
    id: string
  ): Promise<{ event: JsonEvent<Document> | XmlEvent | SqsEvent<Document>; responses: EventResponse[] }> {
    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          timeout: 3000,
          hostname: 'dev-api.anticipated.io',
          method: 'GET',
          path: `/v1/event/${id}`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': this._key
          }
        },
        (response) => {
          let responseBody = ''
          response.on('data', (chunk) => (responseBody += chunk))
          response.on('end', () => {
            const result = JSON.parse(responseBody)
            if (response.statusCode && (response.statusCode < 200 || response.statusCode > 299)) {
              reject(result.message)
            }
            resolve({ event: result.event, responses: result.responses ?? [] })
          })
        }
      )
      req.on('error', (error) => {
        reject(error)
      })
      req.end()
    })
  }

  public async delete(id: string): Promise<JsonResponse<Document>> {
    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'dev-api.anticipated.io',
          method: 'DELETE',
          path: `/v1/event/${id}`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': this._key
          }
        },
        (response) => {
          let responseBody = ''
          response.on('data', (chunk) => (responseBody += chunk))
          response.on('end', () => {
            const result = JSON.parse(responseBody)
            if (response.statusCode && (response.statusCode < 200 || response.statusCode > 299)) {
              reject(result.message)
            }
            resolve({
              now: DateTime.fromISO(result.now),
              event: result.event
            })
          })
        }
      )
      req.on('error', (error) => {
        reject(error)
      })
      req.end()
    })
  }
}
export default AnticipatedEvents
