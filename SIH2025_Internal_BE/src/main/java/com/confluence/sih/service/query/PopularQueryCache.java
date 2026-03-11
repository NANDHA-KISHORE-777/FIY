package com.confluence.sih.service.query;

import com.confluence.sih.model.PopularQuery;
import com.confluence.sih.repository.PopularQueryRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class PopularQueryCache {

    private static final int MAX_CACHE_SIZE = 5;

    private final Map<String, PopularQuery> cache = new HashMap<>();
    private final PopularQueryRepository repo;

    public PopularQueryCache(PopularQueryRepository repo) {
        this.repo = repo;
        loadFromDB();
    }

    private void loadFromDB() {
        repo.findAll().forEach(pq -> cache.put(pq.getUserPrompt(), pq));
        evictIfNeeded();
    }

    public synchronized void recordPrompt(String userPrompt, String query) {
        PopularQuery pq = cache.get(userPrompt);
        if (pq == null) {
            pq = new PopularQuery(userPrompt, query, 1L);
            cache.put(userPrompt, pq);
        } else {
            pq.setQuery(query);
            pq.setCount(pq.getCount() + 1);
        }
        evictIfNeeded();
    }

    public synchronized List<PopularQuery> getTopQueries(int n) {
        return cache.values().stream()
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .limit(n)
                .toList();
    }

    private void evictIfNeeded() {
        while (cache.size() > MAX_CACHE_SIZE) {
            Optional<Map.Entry<String, PopularQuery>> minEntry = cache.entrySet().stream()
                    .min(Comparator.comparingLong(e -> e.getValue().getCount()));
            minEntry.ifPresent(e -> cache.remove(e.getKey()));
        }
    }

    @Scheduled(fixedRate = 3600000)
    public void syncToDB() {
        cache.forEach((prompt, pq) -> repo.save(pq));
    }
}
