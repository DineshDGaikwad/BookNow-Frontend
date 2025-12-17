import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Star, Clock } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

interface EventCardProps {
  id: string;
  title: string;
  image?: string;
  category: string;
  genre?: string;
  venue: string;
  city?: string;
  date: string;
  price: string;
  rating?: number;
  featured?: boolean;
  availableSeats?: number;
}

export function EventCard({
  id,
  title,
  image,
  category,
  genre,
  venue,
  city,
  date,
  price,
  rating,
  featured = false,
  availableSeats,
}: EventCardProps) {
  return (
    <Link
      to={`/events/${id}`}
      className={cn(
        "group block rounded-xl overflow-hidden bg-white border border-gray-200 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:-translate-y-1",
        featured && "ring-2 ring-blue-500/30"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl">
            🎪
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="glass">{category}</Badge>
          {genre && <Badge variant="secondary">{genre}</Badge>}
        </div>

        {/* Featured Badge */}
        {featured && (
          <Badge variant="gold" className="absolute top-3 right-3">
            Featured
          </Badge>
        )}

        {/* Rating */}
        {rating && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-white">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold">{rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{venue}{city && `, ${city}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{date}</span>
          </div>
          {availableSeats && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="text-green-600">{availableSeats} seats available</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-gray-500 text-sm">Starting from</span>
          <span className="font-bold text-blue-600">{price}</span>
        </div>
      </div>
    </Link>
  );
}