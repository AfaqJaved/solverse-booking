import { Business } from '@solverse/domain'
import { BusinessApi } from '@solverse/shared'

export class BusinessMapper {
  static toResponse(business: Business): BusinessApi.GetBusiness.Response {
    const data = business.toRaw()
    return {
      id: data.id,
      ownerId: data.ownerId,
      name: data.name,
      slug: data.slug,
      email: data.email,
      phone: data.phone,
      timezone: data.timezone,
      status: data.status,
      plan: data.plan,
      currency: data.currency,
      logoUrl: data.logoUrl,
      description: data.description,
      website: data.website,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt.toISOString(),
    }
  }
}
