import { Link } from 'react-router-dom'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Calendar, MapPin, Star, Clock, Users, Heart } from 'lucide-react'
import { cn } from '../../lib/utils'

interface EventCardProps {
  event: {
    id: string
    title: string
    category: string
    image: string
    date: string
    time: string
    venue: string
    location: string
    price: number
    rating: number
    reviews: number
    duration: string
    ageRating?: string
    isLiked?: boolean
    availability: 'available' | 'filling-fast' | 'sold-out'
  }
  className?: string
}

export function EventCard({ event, className }: EventCardProps) {
  const availabilityConfig = {
    available: { variant: 'success' as const, text: 'Available' },
    'filling-fast': { variant: 'warning' as const, text: 'Filling Fast' },
    'sold-out': { variant: 'destructive' as const, text: 'Sold Out' }
  }

  return (
    <Card className={cn(
      "group overflow-hidden hover:scale-105 hover:glow-primary transition-all duration-300 cursor-pointer",
      className
    )}>
      <div className="relative">
        {/* Event Image */}
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Floating Actions */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 transition-colors glass",
              event.isLiked && "text-red-500"
            )}
          >
            <Heart className="h-4 w-4" fill={event.isLiked ? "currentColor" : "none"} />
          </Button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-xs">
            {event.category}
          </Badge>
        </div>

        {/* Availability Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant={availabilityConfig[event.availability].variant}>
            {availabilityConfig[event.availability].text}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title & Rating */}
        <div className="space-y-2">
          <Link to={`/events/${event.id}`}>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
          </Link>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-gold fill-gold" />
              <span className="font-medium">{event.rating}</span>
              <span>({event.reviews})</span>
            </div>
            {event.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{event.duration}</span>
              </div>
            )}
            {event.ageRating && (
              <Badge variant="outline" className="text-xs">
                {event.ageRating}
              </Badge>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mt-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{event.date} • {event.time}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.venue}, {event.location}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Starts at</div>
            <div className="text-2xl font-bold text-primary">
              ₹{event.price}
            </div>
          </div>
          
          <Button 
            variant={event.availability === 'sold-out' ? 'outline' : 'default'}
            disabled={event.availability === 'sold-out'}
            asChild={event.availability !== 'sold-out'}
          >
            {event.availability === 'sold-out' ? (
              'Sold Out'
            ) : (
              <Link to={`/events/${event.id}`}>
                Book Now
              </Link>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}